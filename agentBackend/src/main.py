from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn 
import json
from dotenv import load_dotenv
import os 
import requests


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

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_pool_metadata")
async def get_pool_metadata(blockchain : str, pair_address: str):
    response = requests.get(base_url_v2+"/pool/metadata?blockchain="+blockchain+"&pair_address="+pair_address, headers=headers)
    return response.json()

@app.get("/get_pool_metric")
async def get_pool_metric(pair_address: str):
    response = requests.get(base_url+"/pool/metrics?pair_address="+pair_address, headers=headers)
    return response.json()

@app.get("/get_pool_by_protocol")
async def get_pool_by_protocol(protocol: str):
    response = requests.get(base_url+"/pool?protocol="+protocol, headers=headers)
    return response.json()

@app.get("/get_dex_pool_metrics")
async def get_dex_pool_metrics(blockchain: str, pair_address: str):
    response = requests.get(base_url+"/pool/metrics?blockchain="+blockchain+"&pair_address="+pair_address, headers=headers)
    return response.json()

@app.get("/get_protocol_metadata")
async def get_protocol_metadata(blockchain: str, protocol: str):
    response = requests.get(base_url_v2+"/pool?blockchain="+blockchain+"protocol="+protocol, headers=headers)
    return response.json()

@app.get("/get_defi_protocols")
async def get_defi_protocols(blockchain: str):
    response = requests.get(base_url_v2+"/pool/supported_protocols?blockchain="+blockchain, headers=headers)
    return response.json()

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, log_level="info")   