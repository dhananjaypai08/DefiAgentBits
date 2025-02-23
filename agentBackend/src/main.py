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

blockchains = ["ethereum", "polygon", "avalanche", "linea"]
documents = []
protocols = [0]*4

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/get_dex_pool_metrics")
async def get_dex_pool_metrics(blockchain: str, pair_address: str):
    response = requests.get(base_url_v2+"/pool/metrics?blockchain="+blockchain+"&pair_address="+pair_address, headers=headers)
    data = response.json()
    global documents
    documents.append(str(data))
    return data

@app.get("/get_protocol_metadata")
async def get_protocol_metadata(blockchain: str, protocol: str):
    response = requests.get(base_url_v2+"/pool?blockchain="+blockchain+"&protocol="+protocol+"&offset=0&limit=30", headers=headers)
    data = response.json()["data"]
    
    return data

@app.get("/get_defi_protocols")
async def get_defi_protocols(blockchain: str):
    response = requests.get(base_url_v2+"/pool/supported_protocols?blockchain="+blockchain, headers=headers)
    print(response)
    data = response.json()["data"]

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