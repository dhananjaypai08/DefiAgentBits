import cohere
from dotenv import load_dotenv
import os 

load_dotenv()

api_key = os.environ.get("COHERE_API_KEY")

co = cohere.ClientV2(api_key=api_key)

async def normal_chat(prompt: str):
    try:
        # Stream the response from Cohere
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": """Context: You are an expert DeFi Optimizer. 
                    Instructions: 
                    - Generate a JSON response for a user query about DeFi protocols and strictly adhere to the below given points without None values
                    - Analyze the user's query about DeFi protocols
                    - Provide a comprehensive, step-by-step response
                    - Include protocol recommendations, potential benefits, and risks
                    - Format response as a clean, informative JSON object
                    - For every single response, Include the 'total slippage', 'net gains', 'safe and recommended protocols', 'estimate time for swap', 'potential fees' as statistics
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field
                    
                    Required JSON Structure:
                    {
                        "protocol_name": "string",
                        "protocol_description": "string",
                        "protocol_steps": [
                            {
                                "step_number": 1,
                                "description": "string",
                                "estimated_time": "string",
                                "potential_fees": "string"
                            }
                        ],
                        "protocol_link": "string",
                        "estimated_slippage": "string",
                        "slippage insights": "string",
                        "overall_benefit": "string",
                        "risks": ["string"],
                        "alternative_protocols": ["string"]
                    }
                """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
async def structured_rag_output(prompt: str, documents: list):
    #print(documents)
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            documents=documents,
            messages=[
                {
                    "role": "system",
                    "content": """Context: You are an expert DeFi Optimizer. 
                    Instructions: 
                    - Generate a JSON response for a user query about DeFi protocols and strictly adhere to the below given points without None values
                    - Analyze the user's query about DeFi protocols
                    - Provide a comprehensive, step-by-step response
                    - Include protocol recommendations, potential benefits, and risks
                    - Format response as a clean, informative JSON object
                    - For every single response, Include the 'total slippage', 'net gains', 'safe and recommended protocols', 'estimate time for swap', 'potential fees' as statistics
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field
                    
                    Required JSON Structure:
                    {
                        "protocol_name": "string",
                        "protocol_description": "string",
                        "protocol_steps": [
                            {
                                "step_number": 1,
                                "description": "string",
                                "estimated_time": "string",
                                "potential_fees": "string"
                            }
                        ],
                        "protocol_link": "string",
                        "estimated_slippage": "string",
                        "slippage insights": "string",
                        "overall_benefit": "string",
                        "risks": ["string"],
                        "alternative_protocols": ["string"]
                    }
                """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            # response_format={"type": "json_object"}
        )
        if "None" in res.message.content[0].text:
            data = await normal_chat(prompt)
            return data
        return res.message.content[0].text
    except Exception as e:
        raise Exception(f"Error generating response: {str(e)}") 
    
