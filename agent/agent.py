import os

from flask import request
from dotenv import load_dotenv
from agent.tools import create_task
from datetime import datetime,timedelta
from main import agent
import requests




load_dotenv()

def parse_date(data):
    pass
    
def create_event():
    """This tool is for creating an event."""
    pass


def run_agent(question : str,context : list[str])->str:
    messages = []

    if context:
        messages.extend(context)

    messages.append({
        "role": "user",
        "content": question
    })

    result = agent.invoke({
        "messages": messages
    })

    structured = result["structured_response"]
    response_data = structured.model_dump()
    return response_data

if __name__ == "__main__":
    run_agent()

