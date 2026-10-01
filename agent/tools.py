from flask import request
from datetime import datetime
import requests


def create_task(
    description: str,
    assign: bool,
    startHour: datetime,
    endHour: datetime
):
    """This tool is for creating a task.

    - description: The description of the task.
    - assign: Whether the task is assigned to the calendar.
    - startHour: The complete start date and time of the task.
      Determine the correct date from the user's wording
      (today, tomorrow, next Monday, etc.).
    - endHour: The complete end date and time of the task.
      If the user does not specify an end time or duration,
      set it to exactly one hour after startHour.
    - startHour and endHour must use the same timezone.
    - Use ISO 8601 datetime format.
    """

    accessToken = request.headers.get("Authorization")

    data = {
        "description": description,
        "startHour": startHour.isoformat(),
        "endHour": endHour.isoformat(),
        "assign": assign,
        "management_id": None
    }

    response = requests.post(
        "http://127.0.0.1:5000/task/task/",
        headers={
            "Authorization": accessToken,
            "Content-Type": "application/json"
        },
        json=data
    )

    print("REQUEST:", data)
    print("RESPONSE:", response.text)

    if response.status_code == 201:
        return {
            "message": "Task created successfully.",
            "calendar_update": True
        }

    return {
        "message": "Task was not created.",
        "calendar_update": False
    }