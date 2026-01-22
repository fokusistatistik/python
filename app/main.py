from fastapi import FastAPI, Depends, HTTPException, Security, UploadFile, File, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Union, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import io
import sys
import platform
import os

app = FastAPI(
    title="Fokus İstatistik API",
    description="Backend engine for Fokus İstatistik Data Analysis Platform",
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# --- Configuration & Security ---
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Hardcoded User
FAKE_USERS_DB = {
    "fokusistatistik": {
        "username": "fokusistatistik",
        "hashed_password": pwd_context.hash("fokusistatistik"),
        "disabled": False,
    }
}

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class JsonDataInput(BaseModel):
    data: List[Union[int, float]]
    label: str = "Values"

# --- Auth Helpers ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = FAKE_USERS_DB.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user

# --- Endpoints ---

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = FAKE_USERS_DB.get(form_data.username)
    if not user or not verify_password(form_data.password, user['hashed_password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/", tags=["System"])
async def root():
    return {"message": "Fokus İstatistik Backend is running", "status": "active"}

@app.get("/system-info", dependencies=[Depends(get_current_user)], tags=["System"])
async def get_system_info():
    """Returns versions of key libraries."""
    return {
        "python": sys.version,
        "platform": platform.platform(),
        "pandas": pd.__version__,
        "numpy": np.__version__,
        "backend": "FastAPI"
    }

@app.post("/analyze-json", dependencies=[Depends(get_current_user)], tags=["Analysis"])
async def analyze_json(input_data: JsonDataInput):
    """Analyzes a list of numbers and returns statistical summary."""
    try:
        df = pd.DataFrame(input_data.data, columns=['value'])
        desc = df['value'].describe().to_dict()
        
        return {
            "summary": {
                "count": int(desc['count']),
                "mean": float(desc['mean']),
                "std": float(desc['std']),
                "min": float(desc['min']),
                "max": float(desc['max']),
                "median": float(df['value'].median()),
            }, 
            "original_data_preview": input_data.data[:5]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/analyze-file", dependencies=[Depends(get_current_user)], tags=["Analysis"])
async def analyze_file(file: UploadFile = File(...)):
    """Accepts CSV or Excel files and returns detailed metrics and preview."""
    try:
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel.")

        # Metrics
        row_count, col_count = df.shape
        missing_values = df.isnull().sum().to_dict()
        
        # Numeric Stats
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        numeric_stats = {}
        for col in numeric_cols:
            series = df[col].dropna()
            if not series.empty:
                numeric_stats[col] = {
                    "mean": float(series.mean()),
                    "median": float(series.median()),
                    "std": float(series.std()),
                    "min": float(series.min()),
                    "max": float(series.max())
                }
                
                # Histogram data
                counts, bin_edges = np.histogram(series, bins='auto')
                numeric_stats[col]["histogram"] = {
                    "counts": counts.tolist(),
                    "bin_edges": bin_edges.tolist()
                }

        # Replace NaNs for JSON serialization
        df_preview = df.head(10).fillna("").to_dict(orient='records')

        return {
            "filename": file.filename,
            "meta": {
                "rows": row_count,
                "cols": col_count,
                "missing_values": missing_values,
                "columns": df.columns.tolist()
            },
            "numeric_stats": numeric_stats,
            "preview": df_preview
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
