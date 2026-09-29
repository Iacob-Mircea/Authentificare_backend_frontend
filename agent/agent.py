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


def run_agent(question : dict)->str:
    
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    
   



