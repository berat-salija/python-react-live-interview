from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from faker import Faker
import random

from models import Base, Product, Category, Inventory

# ---------- FILE-BASED DB (shared across workers) ----------
engine = create_engine(
    f"sqlite:///data.db",
    connect_args={"check_same_thread": False},
    pool_pre_ping=True
)
SessionLocal = sessionmaker(bind=engine)

# Create tables
Base.metadata.create_all(engine)

fake = Faker()
CATEGORIES = [
    "Smartphones",
    "Laptops",
    "Sneakers",
    "Headphones",
    "Books",
    "Cookware",
    "Cameras",
    "Gaming Consoles",
    "Watches",
]
COUNTRIES = ["US", "CA"]

def seed_data():
    session = SessionLocal()
    
    if session.query(Product).count() > 0:
        print("DB already seeded. Skipping.")
        session.close()
        return

    print("Seeding database (US + CA only, 30% out of stock)...")

    # --- 1. Seed Categories (id + name only) ---
    print("  → Seeding 10 categories...")
    category_objs = []
    for name in CATEGORIES:
        cat = Category(name=name)
        session.add(cat)
        category_objs.append(cat)
    session.flush()

    # --- 2. Seed Products ---
    print("  → Seeding 500 products...")
    products = []
    for _ in range(500):
        p = Product(
            name=fake.word().capitalize() + " " + fake.word().capitalize(),
            description=fake.sentence(nb_words=8),
            price=round(random.uniform(9.99, 999.99), 2),
            category_id=random.choice(category_objs).id,
        )
        session.add(p)
        products.append(p)
    session.flush()

    # --- 3. Seed Products ---
    print("  → Seeding 500 products...")
    products = []
    for _ in range(500):
        p = Product(
            name=fake.word().capitalize() + " " + fake.word().capitalize(),
            description=fake.sentence(nb_words=8),
            price=round(random.uniform(9.99, 999.99), 2),
            category_id=random.choice(category_objs).id,
        )
        session.add(p)
        products.append(p)
    session.flush()  # Get product IDs

    # --- 3. Seed Inventory: 30% out of stock in BOTH US and CA ---
    print("  → Seeding inventory (30% out of stock in US+CA)...")
    out_of_stock_count = 0
    in_stock_count = 0

    for idx, product in enumerate(products):
        # First 150 products → OUT OF STOCK in both countries
        is_out_of_stock = idx < 150

        for country in COUNTRIES:
            if is_out_of_stock:
                quantity = 0
                out_of_stock_count += 1
            else:
                quantity = random.randint(1, 100)
                in_stock_count += 1

            session.add(Inventory(
                product_id=product.id,
                country_code=country,
                quantity=quantity
            ))

    # --- 5. Commit ---
    session.commit()
    print(f"Seeded: {len(category_objs)} categories, {len(products)} products, inventory rows")
    session.close()

# ---------- RUN ONCE AT IMPORT (safe: file is shared) ----------
Base.metadata.create_all(engine)
seed_data()  # ← Runs once, all workers see the same file

# ---------- DB DEPENDENCY ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()