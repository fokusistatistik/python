from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List, Union
from pydantic import BaseModel
import pandas as pd
import numpy as np
import io
import sys
import platform

from app.core.security import (
    create_access_token, 
    verify_password, 
    get_current_user, 
    FAKE_USERS_DB, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    Token
)

router = APIRouter()

# --- Models ---
class JsonDataInput(BaseModel):
    data: List[Union[int, float]]
    label: str = "Values"

@router.post("/token", response_model=Token)
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

@router.get("/system-info", dependencies=[Depends(get_current_user)])
async def get_system_info():
    return {
        "python": sys.version,
        "platform": platform.platform(),
        "pandas": pd.__version__,
        "numpy": np.__version__,
        "backend": "FastAPI Modular"
    }

@router.post("/analyze-json", dependencies=[Depends(get_current_user)])
async def analyze_json(input_data: JsonDataInput):
    try:
        df = pd.DataFrame(input_data.data, columns=['value'])
        desc = df['value'].describe().to_dict()
        return {
            "summary": {k: float(v) if isinstance(v, (np.float64, float)) else v for k, v in desc.items()},
            "original_data_preview": input_data.data[:5]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze-file", dependencies=[Depends(get_current_user)])
async def analyze_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Invalid file format.")

        # 1. Basic Describe
        numeric_df = df.select_dtypes(include=[np.number])
        description = numeric_df.describe().to_dict()
        
        # 2. Missing Values
        missing = df.isnull().sum().to_dict()

        # 3. Correlations (Pearson)
        # Handle cases with no numeric cols or single col
        if numeric_df.shape[1] > 1:
            correlation_matrix = numeric_df.corr(method='pearson').fillna(0).to_dict()
        else:
            correlation_matrix = {}

        # 4. Histograms for frontend
        numeric_stats = {}
        for col in numeric_df.columns:
            series = numeric_df[col].dropna()
            if not series.empty:
                counts, bin_edges = np.histogram(series, bins='auto')
                numeric_stats[col] = {
                    "mean": float(series.mean()),
                    "std": float(series.std()),
                    "histogram": {
                        "counts": counts.tolist(),
                        "bin_edges": bin_edges.tolist()
                    }
                }

        return {
            "filename": file.filename,
            "rows": df.shape[0],
            "cols": df.shape[1],
            "columns": df.columns.tolist(),
            "missing_values": missing,
            "description": description,
            "correlation": correlation_matrix,  # New Metric
            "numeric_stats": numeric_stats,     # For charts
            "preview": df.head(10).fillna("").to_dict(orient='records')
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
