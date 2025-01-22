from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn 
import json
from dotenv import load_dotenv
import os 
import requests


bitscrunch_api_key = os.environ.get("BITSCRUNCH_API_KEY")  
base_url = "https://api.unleashnfts.com/api/v1/defi"
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


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_pool_metadata")
async def get_pool_metadata(pair_address: str):
    response = requests.get(base_url+"/pool/metadata?pair_address="+pair_address, headers=headers)
    return response.json()

@app.get("/get_pool_metric")
async def get_pool_metric(pair_address: str):
    response = requests.get(base_url+"/pool/metrics?pair_address="+pair_address, headers=headers)
    return response.json()

@app.get("/get_pool_by_protocol")
async def get_pool_by_protocol(protocol: str):
    response = requests.get(base_url+"/pool?protocol="+protocol, headers=headers)
    return response.json()

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, log_level="info")   