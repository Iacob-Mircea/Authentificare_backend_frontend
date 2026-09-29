from flask_restx import Namespace,Resource,fields
from flask import request
from models import ListManagement



listM_ns = Namespace("ListManagement",description="The public Lists of all user")

listFields = listM_ns.model(
    "list",
    {   
        "message" : fields.String(),
        "title" : fields.String(),
        "description" : fields.String(),
    }
)


@listM_ns.route("/listsManagement")
class Lists(Resource):
    @listM_ns.marshal_with(listFields,as_list= True)
    def get(self):
        lists = ListManagement.query.all()

        if lists:
            return lists,200

        return {"message":"Niciun program public"},400
    

   

        
        
