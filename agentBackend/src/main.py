from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn 
import json
from dotenv import load_dotenv
import os 
import requests
from aiagent import normal_chat, structured_rag_output


bitscrunch_api_key = os.environ.get("BITSCRUNCH_API_KEY")  
base_url = "https://api.unleashnfts.com/api/v1/defi"
base_url_v2 = "https://api.unleashnfts.com/api/v2/defi"
headers = {
    "accept": "application/json",
    "x-api-key": bitscrunch_api_key
}
load_dotenv()
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

protocols = ["uniswap", "sushiswap", "balancer", "curve", "compound", "aave", "dydx", "cream", "maker", "yearn", "synthetix", "1inch", "loopring", "bancor", "kyber", "mstable", "dodo", "mcdex", "perpetual", "defiswap", "defisaver", "defiexplore"]
blockchains = ["ethereum", "polygon", "avalanche", "linea"]
documents = []

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_pool_metadata")
async def get_pool_metadata(blockchain : str, pair_address: str):
    response = requests.get(base_url_v2+"/pool/metadata?blockchain="+blockchain+"&pair_address="+pair_address, headers=headers)
    data = response.json()
    global documents
    documents.append(data)
    return data

@app.get("/get_pool_metric")
async def get_pool_metric(pair_address: str):
    response = requests.get(base_url+"/pool/metrics?pair_address="+pair_address, headers=headers)
    data = response.json()
    global documents
    documents.append(data)
    return data

@app.get("/get_pool_by_protocol")
async def get_pool_by_protocol(protocol: str):
    response = requests.get(base_url+"/pool?protocol="+protocol, headers=headers)
    data = response.json()
    global documents
    documents.append(data)
    return data

@app.get("/get_dex_pool_metrics")
async def get_dex_pool_metrics(blockchain: str, pair_address: str):
    response = requests.get(base_url+"/pool/metrics?blockchain="+blockchain+"&pair_address="+pair_address, headers=headers)
    data = response.json()
    global documents
    documents.append(data)
    return data

@app.get("/get_protocol_metadata")
async def get_protocol_metadata(blockchain: str, protocol: str):
    response = requests.get(base_url_v2+"/pool?blockchain="+blockchain+"protocol="+protocol, headers=headers)
    data = response.json()
    global documents
    documents.append(data)
    return data

@app.get("/get_defi_protocols")
async def get_defi_protocols(blockchain: str):
    response = requests.get(base_url_v2+"/pool/supported_protocols?blockchain="+blockchain, headers=headers)
    data = response.json()
    global documents
    documents.append(data)
    return data

@app.post("/stream_chat")
async def stream_chat(request: Request):
    data = await request.json()
    prompt = data["prompt"]
    res = await normal_chat(prompt)
    return res

@app.post("/stream_rag_output")
async def stream_rag_output(request: Request):
    data = await request.json()
    prompt = data["prompt"]
    res = await structured_rag_output(prompt, documents)
    return res

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, log_level="info")   