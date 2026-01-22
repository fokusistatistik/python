from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints

app = FastAPI(
    title="Fokus İstatistik Python Engine",
    description="Advanced Data Analysis API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(endpoints.router, prefix="/api", tags=["API"])

@app.get("/")
async def root():
    return {"status": "active", "service": "Fokus İstatistik Engine"}
