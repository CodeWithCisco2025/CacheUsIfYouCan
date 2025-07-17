# Requirements:
# pip install langchain llama-index flask ollama qdrant-client

from flask import Flask, request, jsonify
from langchain.llms import Ollama
from langchain.agents import initialize_agent, Tool
from langchain.tools import tool
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama as LlamaIndexOllama
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
import requests
import os

app = Flask(__name__)

###########################
# MOCK MONITORING ENDPOINTS
###########################

def get_metrics():
    return {
        "service_A_latency": "2100ms",
        "cpu_usage": "85%",
        "memory_pressure": "high"
    }

def get_logs():
    return [
        "ERROR: Service-A latency spike detected",
        "WARN: Memory threshold exceeded on node-4"
    ]

def get_remediation_actions():
    return [
        {"action": "reroute", "target": "service-A", "destination": "service-B", "status": "success"},
        {"action": "scale", "target": "service-A", "instances_added": 3, "status": "success"}
    ]

#######################
# LLM + RAG SETUP (LOCAL)
#######################
ollama_llm = Ollama(model="mistral")

# Setup llama-index with local docs
service_context = ServiceContext.from_defaults(
    llm=LlamaIndexOllama(model="mistral"),
    embed_model=OllamaEmbedding(model_name="mistral")
)

docs_path = "docs/"  # Folder with release notes, runbooks, etc.
documents = SimpleDirectoryReader(docs_path).load_data()
index = VectorStoreIndex.from_documents(documents, service_context=service_context)
query_engine = index.as_query_engine()

####################
# LangChain TOOLS
####################

@tool
def fetch_metrics(query: str) -> str:
    metrics = get_metrics()
    return f"Metrics: {metrics}"

@tool
def fetch_logs(query: str) -> str:
    logs = get_logs()
    return f"Logs: {logs}"

@tool
def fetch_remediation(query: str) -> str:
    actions = get_remediation_actions()
    return f"Recent remediation actions: {actions}"

@tool
def query_documentation(query: str) -> str:
    response = query_engine.query(query)
    return str(response)

llm_agent = initialize_agent(
    tools=[fetch_metrics, fetch_logs, fetch_remediation, query_documentation],
    llm=ollama_llm,
    agent="zero-shot-react-description",
    verbose=True
)

########################
# FLASK API ENDPOINT
########################

@app.route("/insights", methods=["POST"])
def generate_insight():
    user_query = request.json.get("query", "Summarize current system health and suggest actions for netwrork remediation.")
    response = llm_agent.run(user_query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
