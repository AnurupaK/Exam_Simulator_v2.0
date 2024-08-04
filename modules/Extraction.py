import re
import json

def extract_question_details(response):
    # Define regex to match the entire question block including nested structures
    question_blocks = re.findall(r'\*\*Question\d+\*\*\s*(\{.*?\})(?=\s*\*\*Question|\s*$)', response, re.DOTALL)
    
    questions = []
    for block in question_blocks:
        try:
            # Replace single quotes with double quotes, carefully avoiding nested strings
            json_like_str = re.sub(r"(?<=: )'([^']+)'", r'"\1"', block)  # Replace inner dict single quotes
            json_like_str = re.sub(r"'", '"', json_like_str)  # Replace outer dict single quotes
            # Parse the JSON-like dictionary
            question_data = json.loads(json_like_str)
            questions.append(question_data)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {block}, error: {e}")
    print("from module....",questions)
    
    return questions

