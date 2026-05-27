from flask_restx import Resource, Namespace, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from dateutil import parser
from models import EventModel, TaskModel, Management
from datetime_utils import parse_api_datetime, format_api_datetime

calendar_ns = Namespace("calendar", description="Calendar events API")

CATEGORY_COLORS = {
    "meeting": "#2563eb",
    "reminder": "#f97316",
    "personal": "#6b7280",
}

TASK_COLORS = ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#0891b2"]


def current_user_id():
    return int(get_jwt_identity())


def category_color(category):
    return CATEGORY_COLORS.get(category, "#2563eb")


def task_to_calendar_event(task):
    management = task.management
    color = TASK_COLORS[task.id % len(TASK_COLORS)]
    if management:
        color = "#7c3aed" if management.type else "#2563eb"

    return {
        "id": f"task-{task.id}",
        "title": task.description,
        "start": format_api_datetime(task.startHour),
        "end": format_api_datetime(task.endHour),
        "backgroundColor": color,
        "borderColor": color,
        "extendedProps": {
            "type": "task",
            "taskId": task.id,
            "description": task.description,
            "data": task.data.isoformat() if task.data else None,
            "assign": task.assign,
            "managementId": task.management_id,
            "managementTitle": management.title if management else None,
        },
    }


def event_to_calendar_event(event):
    return {
        "id": f"event-{event.id}",
        "title": event.title,
        "start": format_api_datetime(event.start_at),
        "end": format_api_datetime(event.end_at),
        "backgroundColor": event.color,
        "borderColor": event.color,
        "extendedProps": {
            "type": "event",
            "eventId": event.id,
            "description": event.description,
            "category": event.category,
        },
    }


eventFields = calendar_ns.model(
    "SimpleEvent",
    {
        "title": fields.String(required=True),
        "description": fields.String,
        "start_at": fields.DateTime(required=True),
        "end_at": fields.DateTime(required=True),
        "category": fields.String,
        "color": fields.String,
    },
)


@calendar_ns.route("/events")
class CalendarEventsResource(Resource):
    @jwt_required()
    def get(self):
        user_id = current_user_id()
        start = request.args.get("start")
        end = request.args.get("end")
        filter_type = request.args.get("type", "all")

        if not start or not end:
            return {"message": "start and end query params are required"}, 400

        start_dt = parse_api_datetime(start)
        end_dt = parse_api_datetime(end)

        results = []

        if filter_type in ("all", "task"):
            tasks = TaskModel.query.filter(
                TaskModel.user_id == user_id,
                TaskModel.startHour <= end_dt,
                TaskModel.endHour >= start_dt,
            ).all()
            results.extend(task_to_calendar_event(t) for t in tasks)

        if filter_type in ("all", "event"):
            events = EventModel.query.filter(
                EventModel.user_id == user_id,
                EventModel.start_at <= end_dt,
                EventModel.end_at >= start_dt,
            ).all()
            results.extend(event_to_calendar_event(e) for e in events)

        return results, 200


@calendar_ns.route("/simple-events")
class SimpleEventsResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = current_user_id()
        category = data.get("category", "meeting")
        color = data.get("color") or category_color(category)

        event = EventModel(
            title=data["title"],
            description=data.get("description", ""),
            start_at=parse_api_datetime(data["start_at"]),
            end_at=parse_api_datetime(data["end_at"]),
            category=category,
            color=color,
            user_id=user_id,
        )
        event.save()
        return event_to_calendar_event(event), 201


@calendar_ns.route("/simple-events/<int:id>")
class SimpleEventResource(Resource):
    @jwt_required()
    def put(self, id):
        event = EventModel.query.filter_by(
            id=id, user_id=current_user_id()
        ).first()
        if not event:
            return {"message": "Event not found"}, 404

        data = request.get_json()
        category = data.get("category", event.category)
        event.update(
            title=data.get("title"),
            description=data.get("description"),
            start_at=parse_api_datetime(data["start_at"]) if data.get("start_at") else None,
            end_at=parse_api_datetime(data["end_at"]) if data.get("end_at") else None,
            category=category,
            color=data.get("color") or category_color(category),
        )
        return event_to_calendar_event(event), 200

    @jwt_required()
    def delete(self, id):
        event = EventModel.query.filter_by(
            id=id, user_id=current_user_id()
        ).first()
        if not event:
            return {"message": "Event not found"}, 404
        event.delete()
        return {"message": "deleted"}, 200


@calendar_ns.route("/events/<string:event_type>/<int:id>")
class CalendarEventPatchResource(Resource):
    @jwt_required()
    def patch(self, event_type, id):
        data = request.get_json()
        user_id = current_user_id()

        if not data.get("start") or not data.get("end"):
            return {"message": "start and end are required"}, 400

        start_dt = parse_api_datetime(data["start"])
        end_dt = parse_api_datetime(data["end"])

        if event_type == "task":
            task = TaskModel.query.filter_by(id=id, user_id=user_id).first()
            if not task:
                return {"message": "Task not found"}, 404
            task.update(
                task.description,
                start_dt,
                end_dt,
                data=task.data,
                management_id=task.management_id,
                assign=task.assign,
            )
            return task_to_calendar_event(task), 200

        if event_type == "event":
            event = EventModel.query.filter_by(id=id, user_id=user_id).first()
            if not event:
                return {"message": "Event not found"}, 404
            event.update(start_at=start_dt, end_at=end_dt)
            return event_to_calendar_event(event), 200

        return {"message": "Invalid event type"}, 400


@calendar_ns.route("/categories")
class CalendarCategoriesResource(Resource):
    @jwt_required()
    def get(self):
        user_id = current_user_id()
        managements = Management.query.filter_by(user_id=user_id).all()
        return [
            {
                "id": m.id,
                "title": m.title,
                "type": m.type,
            }
            for m in managements
        ], 200
