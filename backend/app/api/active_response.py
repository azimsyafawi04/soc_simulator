from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ActiveResponseRequest(BaseModel):
    target_ip: str
    action_type: str
    rule_id: str = "N/A"

@router.post("/")
def execute_active_response(request: ActiveResponseRequest):
    # Simulated Wazuh-style Active Response execution
    # In production, this would SSH into an endpoint, trigger a firewall API, or publish to an agent queue
    
    print(f"Executing Active Response: Action '{request.action_type}' targeting {request.target_ip} for Rule {request.rule_id}")
    
    return {
        "status": "success",
        "action_taken": request.action_type,
        "target": request.target_ip,
        "message": f"Successfully executed '{request.action_type}' on target {request.target_ip}"
    }
