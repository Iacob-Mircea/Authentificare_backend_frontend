import os
from flask import request
from datetime import datetime,timedelta
import requests

def create_task(description : str,assign : bool, offsetDays : int,offsetHour : int,offsetMinutes : int ,accessToken : str,user_id : int,management_id : int,duration : int = 1):
    """This tool is for creating a task.
    - description : an string the description of the task
    - assig : the task is assigned to the calendar or not
    - offsetDays : offset in days of the task the user wants to create(ex: tomorrow = 1 , maine = 1, one week from now = 7 etc)
    - offsetHour : the hour the user wants the task to begin(take as default pm)(ex :2 = 14, 2 in the morning = 2 etc )
    - duration : the duration of the task if not specified it`s one hour
    """
    date = datetime.now()
    startHour = date + timedelta(days=offsetDays)
    startHour = startHour.replace(hour= offsetHour,minute=offsetMinutes)
    endHour = startHour + timedelta(hours= duration)
    params = {"description" : description, "startHour": startHour,"endHour": endHour,"assign":assign,"management_id" : management_id,"user_id": user_id}
    response = requests.post("http://127.0.0.1:5000/task/task/",headers={"Authorization": f"Bearer {accessToken}"},params=params)
    if response.status_code == 201:
        return "Task created successfully."
    else:
        return "Task did not create"