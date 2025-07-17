from fastapi import FastAPI
from pydantic import BaseModel
from langchain.agents import initialize_agent, AgentType
from langchain.agents.agent import AgentExecutor
from langchain_core.tools import tool
from langchain_core.exceptions import OutputParserException
from langchain_community.llms import Ollama

# Initialize FastAPI
app = FastAPI()

#########################################
# Realistic Data Simulations (Mocked)
#########################################

def get_metrics():
    return {
        "memory": {
            "totalMB": 7877,
            "usedMB": 7019,
            "freeMB": 858,
            "usagePercent": 89.11
        },
        "uptimeSeconds": 269696.484,
        "systemMetrics": {
            "disk": [
                {
                    "device": "\\\\.\\PHYSICALDRIVE0",
                    "type": "SSD",
                    "name": "NVMe PM991a NVMe Samsung 512GB",
                    "health": "Ok",
                    "sizeGB": 512.11
                }
            ],
            "trafficAnalysis": [
                {
                    "iface": "Wi-Fi",
                    "rxBytes": 446554060,
                    "txBytes": 48075905,
                    "rxSec": None,
                    "txSec": None,
                    "throughputMbps": 0,
                    "isSpike": False,
                    "isDrop": True
                }
            ],
            "latencyMs": 10
        }
    }

def get_logs():
    return [
        "ERROR: Latency spike in Service-A",
        "WARN: Memory pressure on Node-4",
        "INFO: Disk health check OK"
    ]

def get_remediation_actions():
    return [
        {"action": "scale", "service": "Service-A", "status": "success"},
        {"action": "reroute", "from": "Node-4", "to": "Node-7", "status": "success"}
    ]

def analyze_traffic():
    return {
        "good_requests": 8500,
        "bad_requests": 523,
        "unusual_patterns": [
            {"endpoint": "/api/data", "issue": "Spike in 5xx errors"},
            {"source": "192.168.10.5", "issue": "High request rate, flagged as rogue"}
        ]
    }

#########################################
# Define Tools
#########################################

@tool
def fetch_metrics(query: str) -> str:
    """Fetch system metrics including memory, uptime, disk, and traffic."""
    return str(get_metrics())

@tool
def fetch_logs(query: str) -> str:
    """Fetch recent logs including errors and warnings."""
    return str(get_logs())

@tool
def fetch_remediation_actions(query: str) -> str:
    """Get the list of past remediation actions taken by the system."""
    return str(get_remediation_actions())

@tool
def analyze_traffic_patterns(query: str) -> str:
    """Analyze traffic patterns: good/bad requests, spikes, rogue IPs."""
    return str(analyze_traffic())

@tool
def query_documentation(query: str) -> str:
    """Return info from internal documentation (simulated)."""
    return "📚 Internal documentation access is disabled for this environment."

# Register tools
tools = [
    fetch_metrics,
    fetch_logs,
    fetch_remediation_actions,
    analyze_traffic_patterns,
    query_documentation
]

# Load LLM from Ollama (Gemma 2b)
llm = Ollama(model="gemma:2b")

# LangChain Agent with the tools and model
llm_agent: AgentExecutor = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True
)

# Input model
class QueryInput(BaseModel):
    query: str

#########################################
# FastAPI Endpoints
#########################################

@app.get("/")
async def root():
    return {"message": "🚀 GenAI Insights API with Ollama + Gemma 2b is up and running!"}

@app.post("/insights")
async def generate_insight(data: QueryInput):
    try:
        response = llm_agent.run(data.query)
        return {"response": response}
    except OutputParserException as e:
        return {"error": "LLM parsing failed", "details": str(e)}
    except Exception as e:
        return {"error": "Unhandled error", "details": str(e)}
