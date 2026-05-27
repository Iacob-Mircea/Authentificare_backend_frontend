from flask_restx import Api,Resource,Namespace,fields,marshal_with
from main import Api

land = Namespace("LandingPage",description="Landing pageul")

@land.route("/")
class LandingPage(Resource):
    def get(self):
        return {"message":"status_ok"},200


