import requests
import json
import os
import re
from urllib.parse import urlparse
#from dotenv import load_dotenv
import google.generativeai as genai  # Updated Gemini import

# Load environment variables
#load_dotenv()

# Set up API keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

headers = {"Authorization": f"token {GITHUB_TOKEN}"}

def parse_github_url(url):
    """Extract owner and repo name from GitHub URL."""
    print(f"🔍 Parsing GitHub URL: {url}")
    # Handle URLs like:
    # https://github.com/owner/repo
    # https://github.com/owner/repo.git
    # git@github.com:owner/repo.git
    if url.startswith('git@'):
        pattern = r'git@github\.com:([^/]+)/([^/.]+)'
    else:
        pattern = r'github\.com/([^/]+)/([^/.]+)'
    
    match = re.search(pattern, url)
    if not match:
        raise ValueError("Invalid GitHub URL")
    
    print(f"✅ Parsed successfully: owner={match.group(1)}, repo={match.group(2)}")
    return match.group(1), match.group(2)

# 🔹 Get all repo contents
def get_repo_contents(owner, repo, path=""):
    print(f"🔄 Fetching contents for: {owner}/{repo} at path: {path}")
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print(f"✅ Successfully fetched {len(response.json())} items.")
        return response.json()
    else:
        print(f"❌ Error fetching contents: {response.status_code}")
    return []

# 🔹 Scan repo structure
def scan_repo(owner, repo):
    print(f"📂 Scanning repository structure for: {owner}/{repo}")
    repo_structure = []
    queue = [""]  # Start with root directory

    while queue:
        current_path = queue.pop(0)
        contents = get_repo_contents(owner, repo, current_path)

        for item in contents:
            file_info = {"name": item["name"], "path": item["path"], "type": item["type"]}
            if item["type"] == "dir":
                queue.append(item["path"])  # Recursively scan subfolders
            elif item["type"] == "file":
                file_info["download_url"] = item["download_url"]
            repo_structure.append(file_info)

    print(f"✅ Scanned {len(repo_structure)} items in the repo structure.")
    return repo_structure

# 🔹 Extract relevant files for AI analysis
def extract_relevant_files(repo_data):
    print(f"🔍 Extracting relevant files from {len(repo_data)} files/directories.")
    important_files = []
    for file in repo_data:
        if any(file["name"].endswith(ext) for ext in ["README.md", ".py", ".js", ".java", "package.json", "requirements.txt", "Dockerfile"]):
            important_files.append(file)
    print(f"✅ Extracted {len(important_files)} relevant files for analysis.")
    return important_files

# 🔹 Fetch file content
def get_file_content(url):
    print(f"🔄 Fetching file content from: {url}")
    response = requests.get(url)
    if response.status_code == 200:
        print(f"✅ Successfully fetched file content.")
        return response.text
    else:
        print(f"❌ Error fetching file content: {response.status_code}")
    return ""

# 🔹 Extract and format dependencies from package.json and requirements.txt
def extract_dependencies(files_data):
    """Extract and format dependencies from package.json and requirements.txt"""
    dependencies = []
    
    # Extract from package.json
    if 'package.json' in files_data:
        try:
            package_json = json.loads(files_data['package.json'])
            if 'dependencies' in package_json:
                for name, version in package_json['dependencies'].items():
                    version = version.replace('^', '').replace('~', '')
                    dependencies.append({
                        "name": name,
                        "version": version,
                        "description": f"Used in the frontend. Part of the React/Node.js ecosystem."
                    })
        except json.JSONDecodeError:
            print("❌ Error parsing package.json")

    # Extract from requirements.txt
    if 'requirements.txt' in files_data:
        for line in files_data['requirements.txt'].split('\n'):
            if line.strip() and not line.startswith('#'):
                parts = line.split('==')
                if len(parts) == 2:
                    name, version = parts
                    dependencies.append({
                        "name": name.strip(),
                        "version": version.strip(),
                        "description": f"Used in the Python backend/agent system."
                    })

    return {"dependencies": dependencies}

# 🔹 Generate summary using Gemini AI
def summarize_repo(files_data):
    print("🔍 Generating summary using Gemini AI...")
    # Configure the Gemini API
    genai.configure(api_key=GEMINI_API_KEY)
   

    try:
        # Create a model instance using standard Gemini model
        model = genai.GenerativeModel('models/gemini-2.0-flash-lite')

        # Extract dependencies first
        deps_json = extract_dependencies(files_data)

        # Prepare the input for Gemini
        prompt = f"""
        The following are files from a GitHub repo. Analyze the usage of packages used in different parts of the repo,
        categorizing by frontend/backend/etc. Summarize what are the major functionalities/APIs of packages that are 
        used in different parts of the repo.
        Output in a valid json format with a list of objects with the following fields:
        - Package name
        - Package version
        - Functionality/APIs
        - which part of the repo it is used in

        Files:
        {json.dumps(files_data, indent=2)}
        """

        # Generate content with the updated API
        response = model.generate_content(prompt)
        
        print('writing json to dump.json');
        with open('dump.json', 'w') as f:
            json.dump(json.loads(response.parts[0].text.strip('```')[4:]), f)
        if response:
            print("✅ Summary generated successfully.")
            
            # Save both summary and dependencies to a JSON file
            output = {
                "summary": response.text,
                "dependencies": deps_json["dependencies"]
            }
            
            # Save to file
            output_file = "repo_analysis.json"
            with open(output_file, 'w') as f:
                json.dump(output, f, indent=2)
            print(f"✅ Analysis saved to {output_file}")
            
            return json.dumps(output, indent=2)
        else:
            print("❌ Failed to generate summary.")
            return ""
    except Exception as e:
        print(f"❌ Error in Gemini API: {str(e)}")
        return f"Error generating summary: {str(e)}"

def analyze_github_repo(github_url):
    """Main function to analyze a GitHub repository by URL."""
    try:
        # Parse GitHub URL to get owner and repo name
        owner, repo = parse_github_url(github_url)
        print(f"📂 Analyzing repository: {owner}/{repo}")

        # Scan repository structure
        repo_data = scan_repo(owner, repo)
        print(f"Found {len(repo_data)} files/directories")

        # Extract and analyze relevant files
        relevant_files = extract_relevant_files(repo_data)
        print(f"Analyzing {len(relevant_files)} relevant files...")

        # Fetch content for relevant files
        files_content = {file["name"]: get_file_content(file["download_url"]) for file in relevant_files}

        # Generate AI summary
        summary = summarize_repo(files_content)

        # Output results
        print("\n🔍 Repo Summary:")
        print(summary)

        return summary

    except Exception as e:
        print(f"❌ Error analyzing repository: {str(e)}")
        return None

if __name__ == "__main__":
    # Example usage
    try:
        print("Welcome to GitHub Repository Analyzer!")
        github_url = input("Enter GitHub repository URL (e.g., https://github.com/username/repo): ")
        if not github_url:
            print("❌ Error: Please provide a GitHub URL")
            exit(1)
        analyze_github_repo(github_url)
    except KeyboardInterrupt:
        print("\n👋 Exiting...")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
