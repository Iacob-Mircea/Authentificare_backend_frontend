from flask_restx import Resource, fields, Namespace, marshal_with
from models import Management, TaskModel
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from dateutil import parser
from datetime_utils import parse_api_datetime

task_ns = Namespace("task", description="The namespace for announcements")


def current_user_id():
    return int(get_jwt_identity())


announFields = task_ns.model(
    "Management",
    {
        "id": fields.Integer,
        "title": fields.String(),
        "description": fields.String(),
        "type": fields.Boolean,
        "user_id": fields.Integer,
    },
)

taskFieldsGet = task_ns.model(
    "TaskGet",
    {
        "id": fields.Integer,
        "description": fields.String,
        "data": fields.Date,
        "startHour": fields.DateTime,
        "endHour": fields.DateTime,
        "assign": fields.Boolean,
        "management_id": fields.Integer,
        "user_id": fields.Integer,
    },
)

taskFields = task_ns.model(
    "Task",
    {
        "description": fields.String,
        "data": fields.Date,
        "startHour": fields.DateTime,
        "endHour": fields.DateTime,
        "assign": fields.Boolean,
        "management_id": fields.Integer,
    },
)


@task_ns.route("/management")
class AnnouncementsResource(Resource):
    @jwt_required()
    @task_ns.marshal_list_with(announFields)
    def get(self):
        user_id = current_user_id()
        announcements = Management.query.filter_by(user_id=user_id).all()
        return announcements, 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = current_user_id()
        ann = Management.query.filter_by(
            user_id=user_id, title=data["title"], description=data["description"]
        ).first()
        if ann is not None:
            return {"status": "a mai fost incarcat o data acest anunt"}, 400
        announs = Management(
            title=data["title"],
            description=data["description"],
            type=data.get("type", False),
            user_id=user_id,
        )
        announs.save()
        return {"message": "announcement was posted"}, 201


@task_ns.route("/announcements/<int:id>")
class AnnouncemementsResource(Resource):
    @task_ns.marshal_with(announFields)
    def get(self, id):
        announce = Management.query.get_or_404(id)
        return announce, 200

    @task_ns.marshal_with(announFields)
    @jwt_required()
    def put(self, id):
        announce = Management.query.get_or_404(id)
        if announce.user_id != current_user_id():
            return {"message": "Unauthorized"}, 403
        data = request.get_json()
        announce.update(
            data["title"],
            data["description"],
            data.get("type"),
        )
        return announce, 200

    @jwt_required()
    def delete(self, id):
        announce = Management.query.get_or_404(id)
        if announce.user_id != current_user_id():
            return {"message": "Unauthorized"}, 403
        announce.delete()
        return {"message": "deleted"}, 200


@task_ns.route("/task/")
class TaskManagement(Resource):
    @jwt_required()
    @task_ns.marshal_list_with(taskFieldsGet)
    def get(self):
        user_id = current_user_id()
        start = request.args.get("start")
        end = request.args.get("end")

        query = TaskModel.query.filter_by(user_id=user_id)

        if start and end:
            start_dt = parse_api_datetime(start)
            end_dt = parse_api_datetime(end)
            query = query.filter(
                TaskModel.startHour >= start_dt,
                TaskModel.startHour <= end_dt,
            )

        tasks = query.all()
        return tasks, 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = current_user_id()

        task_data = None
        if data.get("data"):
            task_data = parser.isoparse(data["data"]).date()

        newTask = TaskModel(
            description=data["description"],
            data=task_data,
            startHour=parse_api_datetime(data["startHour"]),
            endHour=parse_api_datetime(data["endHour"]),
            assign=data.get("assign", False),
            management_id=data.get("management_id"),
            user_id=user_id,
        )
        newTask.save()
        return {"message": "status_ok", "id": newTask.id}, 201


@task_ns.route("/task/<int:id>")
class TaskManagementID(Resource):
    @jwt_required()
    @task_ns.marshal_with(taskFieldsGet)
    def get(self, id):
        task = TaskModel.query.filter_by(id=id, user_id=current_user_id()).first()
        if task:
            return task, 200
        return {"message": "Nu exista acest task"}, 400

    @jwt_required()
    def put(self, id):
        task = TaskModel.query.filter_by(id=id, user_id=current_user_id()).first()
        if not task:
            return {"message": "Nu exista acest task"}, 401

        data = request.get_json()
        task_data = None
        if data.get("data"):
            task_data = parser.isoparse(data["data"]).date()

        task.update(
            data["description"],
            parse_api_datetime(data["startHour"]),
            parse_api_datetime(data["endHour"]),
            data=task_data,
            management_id=data.get("management_id"),
            assign=data.get("assign"),
        )
        return {"message": "schimbari efectuate"}, 200

    @jwt_required()
    def delete(self, id):
        task = TaskModel.query.filter_by(id=id, user_id=current_user_id()).first()
        if not task:
            return {"message": "Nu exista acest task"}, 401
        task.delete()
        return {"message": "schimbari efectuate"}, 200
