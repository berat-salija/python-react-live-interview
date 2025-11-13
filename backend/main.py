from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_, select, func
from sqlalchemy.orm import Session
import logging
from models import Product, Category, Inventory
from db import get_db

app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enable SQLAlchemy engine logging
logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.ERROR)


# ---------- ENDPOINT ----------
@app.get("/api/products")
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    country_code: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    total = query.count()
    offset = (page - 1) * limit
    results = query.offset(offset).limit(limit).all()
    data = [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": product.category_id,
            "price": product.price,
        }
        for product in results
    ]

    return {
        "data": data,
        "page": page,
        "limit": limit,
        "total": total,
    }
