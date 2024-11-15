from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# import logging
from app.LLM import VoiceAssistantLLM

app = FastAPI()
# logger = logging.getLogger(_name_)
llm = VoiceAssistantLLM()

# Configur

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptionRequest(BaseModel):
    text: str

@app.post("/process")
async def process_transcription(request: TranscriptionRequest):
    try:
        # logger.info(f"Received transcription: {request.text}")
        llm_response = llm.generate_response(request.text)
        if llm_response:
            return {"responseText": llm_response}
        else:
            raise HTTPException(status_code=500, detail="LLM failed to generate a response.")
    except Exception as e:
        # logger.error(f"Error processing transcription: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the transcription.")