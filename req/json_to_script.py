import json
import sys
from typing import Dict, List

def convert_dependencies_to_script(json_data: Dict) -> str:
    """Convert dependencies JSON data into a natural language script."""
    
    # Group dependencies by category
    categories = {}
    for dep in json_data.get("dependencies", []):
        category = dep["which part of the repo it is used in"]
        if category not in categories:
            categories[category] = []
        categories[category].append(dep)
    
    script = """Welcome! Let me walk you through our project's technology stack.
    """
    
    # Process each category
    for category, deps in categories.items():
        script += f"\n\n=== {category} ===\n"
        
        # Sort dependencies by importance (core packages first)
        core_packages = ["react", "typescript", "vite", "fastapi", "python"]
        deps.sort(key=lambda x: (x["Package name"].lower() not in core_packages, x["Package name"]))
        
        for dep in deps:
            name = dep["Package name"]
            version = dep.get("Package version", "latest")
            functionality = dep["Functionality/APIs"]
            
            script += f"\n• {name} (version {version}):\n"
            script += f"  {functionality}\n"
            
            # Add documentation links if available
            if "documentation" in dep:
                for doc in dep["documentation"]:
                    script += f"  📚 {doc['title']}: {doc['url']}\n"
                    script += f"     {doc['explanation']}\n"
    
    return script

def main():
    if len(sys.argv) != 2:
        print("Usage: python json_to_script.py <path_to_json_file>")
        print("Example: python json_to_script.py dependencies-docs.json")
        sys.exit(1)
    
    json_file = sys.argv[1]
    
    try:
        # Load JSON data
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        # Convert to script
        script = convert_dependencies_to_script(data)
        
        # Print the script
        print(script)
        
        # Save to file
        output_file = "generated_script.txt"
        with open(output_file, 'w') as f:
            f.write(script)
        print(f"\n✅ Script has been saved to {output_file}")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{json_file}' not found")
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON in file '{json_file}'")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
