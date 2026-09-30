from fastapi import FastAPI

from app.summary import router as summary_router
from app.transactions import router as transactions_router

app = FastAPI(title="myFinancePal API", version="0.1.0")
app.include_router(transactions_router)
app.include_router(summary_router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
