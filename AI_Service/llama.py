import os
from dotenv import load_dotenv
from groq import Groq
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("API key for Groq AI is not set in the environment variables.")

from groq import Groq

# Initialize the Groq client
client = Groq()

# Assume conversation_history is a global dictionary to store the history of each session
conversation_history = {}

system_instruction = """
Your role is to be an effective and supportive teacher who maintains a strict but polite demeanor. Your primary goal is to generate multiple choice questions (MCQs) in the following format:
**QuestionNumber**
{
    'Question': <Your question here>',
    'Options': {
        'OptionA': '<Your Option A>',
        'OptionB': '<Your Option B>',
        'OptionC': '<Your Option C>',
        'OptionD': '<Your Option D>'
    },
    'Answer': '<Correct answer, not option>'
}
Example
**Question1**
{
    'Question': 'What is the primary function of the print() function in Python?',
    'Options': {
        'OptionA': 'To ask the user for input',
        'OptionB': 'To store a value in a variable',
        'OptionC': 'To display output on the screen',
        'OptionD': 'To calculate the value of a math operation'
    },
    'Answer': 'To display output on the screen'
}
Ensure there is no additional text before or after the JSON-like question dictionaries. Use single quotes for all keys and string values. Strictly don't make mistake with the format. I need the exact question answer format.
"""

def generate_response(session_id, prompt):
    # Retrieve the conversation history for the given session
    history = conversation_history.get(session_id, [])

    # Add the new user prompt to the history
    history.append({"role": "user", "content": prompt})

    # Generate AI response
    response = client.chat.completions.create(
        model='llama-3.1-8b-instant',
        messages=[
            {"role": "system", "content": system_instruction},
            *history  # Include the conversation history
        ],
        temperature=1,
        max_tokens=5000,
        top_p=1
    )

    ai_message = response.choices[0].message.content

    # Add the AI response to the history
    history.append({"role": "assistant", "content": ai_message})

    # Store updated history
    conversation_history[session_id] = history

    return ai_message
