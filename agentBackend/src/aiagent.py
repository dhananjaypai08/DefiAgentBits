import cohere
from dotenv import load_dotenv
import os 

load_dotenv()

api_key = os.environ.get("COHERE_API_KEY")

co = cohere.ClientV2(api_key=api_key)
res = co.chat_stream(
    model="command-r-plus-08-2024",
    messages=[{"role": "user", "content": "What is zero knowledge proof and circuits"}],
)
for event in res:
    if event:
        if event.type == "content-delta":
            print(event.delta.message.content.text, end="")
