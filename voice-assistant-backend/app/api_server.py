from fastapi import FastAPI, HTTPException 
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# import logging
from app.LLM import VoiceAssistantLLM

app = FastAPI()
llm = VoiceAssistantLLM()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptionRequest(BaseModel):
    userId: str
    text: str

@app.post("/process")
async def process_transcription(request: TranscriptionRequest):
    try:
        # Log the incoming request
        # logger.info(f"Received request: {request.dict()}")
        
        # Process the request
        llm_response = await llm.generate_response(request.userId, request.text)
        
        if llm_response:
            return {"responseText": llm_response}
        else:
            raise HTTPException(status_code=500, detail="LLM failed to generate a response.")
    except Exception as e:
        # logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
