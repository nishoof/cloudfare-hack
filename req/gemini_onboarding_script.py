import json
import sys
import os
import google.generativeai as genai
from typing import Dict
from dotenv import load_dotenv

def setup_gemini():
    """Setup Gemini API."""
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('models/gemini-2.0-flash-lite')

def create_gemini_prompt(json_data: Dict) -> str:
    """Create a detailed prompt for Gemini."""
    # Convert JSON to a more readable format for Gemini
    tech_stack = []
    for dep in json_data.get("dependencies", []):
        tech_stack.append(f"""
Package: {dep['Package name']} (v{dep.get('Package version', 'N/A')})
Purpose: {dep['Functionality/APIs']}
Used in: {dep['which part of the repo it is used in']}
""")
    
    prompt = f"""As a senior developer, create an engaging onboarding script that explains our tech stack to a new team member.
The script should be conversational and well-structured.

Here's our tech stack:
{''.join(tech_stack)}

Please create a script that:
1. Gives a high-level overview of our architecture
2. Explains key technologies and why we chose them
3. Highlights important development tools and practices
4. Provides a clear path for getting started
5. Includes specific examples of how different parts work together

Make it engaging and practical, like you're having a conversation with the new team member.
Keep it concise but informative, focusing on what's most important for them to know first.
"""
    return prompt

def generate_onboarding_script(model, json_data: Dict) -> str:
    """Generate onboarding script using Gemini."""
    prompt = create_gemini_prompt(json_data)
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error generating script: {str(e)}")
        return None

def main():
    if len(sys.argv) != 2:
        print("Usage: python gemini_onboarding_script.py <path_to_json_file>")
        print("Example: python gemini_onboarding_script.py dependencies-docs.json")
        sys.exit(1)
    
    json_file = sys.argv[1]
    
    try:
        # Load JSON data
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        # Setup Gemini
        print("🤖 Setting up Gemini...")
        model = setup_gemini()
        
        # Generate script
        print("✍️ Generating onboarding script...")
        script = generate_onboarding_script(model, data)
        
        if script:
            print("\n=== 🎉 Your Onboarding Script ===\n")
            print(script)
            
            # Save to file
            output_file = "onboarding_script.md"
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
