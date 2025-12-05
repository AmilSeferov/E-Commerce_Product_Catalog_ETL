from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from db import get_connection
from etl import sync_categories
from datetime import datetime
import threading

app = FastAPI()

# CORS eyni Node.js-dəki kimi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================
# /products (Lazyl Load)
# ======================
@app.get("/products")
def get_products(limit: int = 20, offset: int = 0):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, title, price, thumbnail, rating
        FROM products
        ORDER BY id
        LIMIT %s OFFSET %s
    """, (limit, offset))

    rows = cursor.fetchall()

    return {
        "data": rows,
        "nextOffset": offset + limit,
        "limit": limit
    }


# ======================
# /product/:id
# ======================
@app.get("/product/{product_id}")
def get_product(product_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # əsas məhsul
    cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    product = cursor.fetchone()

    if not product:
        return {"error": "Product not found"}

    # dimensions  
    cursor.execute("""
        SELECT width, height, depth
        FROM product_dimensions
        WHERE product_id=%s
    """, (product_id,))
    dimensions = cursor.fetchone()

    # images
    cursor.execute("""
        SELECT image_url
        FROM product_images
        WHERE product_id=%s
    """, (product_id,))
    images = cursor.fetchall()

    product["dimensions"] = dimensions
    product["images"] = images

    return product


# ======================
# /categories
# ======================
@app.get("/categories")
def get_categories():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name FROM categories ORDER BY name ASC")
    rows = cursor.fetchall()

    return {"categories": rows}


# ===============================
# /products/category/:id
# ===============================
@app.get("/products/category/{category_id}")
def get_products_by_category(category_id: int, limit: int = 20, offset: int = 0):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.id, p.title, p.price, p.thumbnail, p.rating,
            p.category_id,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id=%s
        ORDER BY p.id ASC
        LIMIT %s OFFSET %s
    """, (category_id, limit, offset))

    rows = cursor.fetchall()

    return {
        "category_id": category_id,
        "count": len(rows),
        "data": rows,
        "nextOffset": offset + limit
    }


# ======================
# /search
# ======================
@app.get("/search")
def search(q: str = ""):
    if not q.strip():
        return {"query": "", "results": []}

    keyword = f"%{q}%"

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.id, p.title, p.price, p.thumbnail, p.rating,
            p.brand, p.category_id, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
            p.title LIKE %s
            OR p.description LIKE %s
            OR p.brand LIKE %s
            OR c.name LIKE %s
        ORDER BY p.id DESC
        LIMIT 200
    """, (keyword, keyword, keyword, keyword))

    rows = cursor.fetchall()

    return {"query": q, "results": rows}


# ======================
# /products/sort
# ======================
@app.get("/products/sort")
def sort_products(by: str, limit: int = 20, offset: int = 0):
    orders = {
        "price_asc": "p.price ASC",
        "price_desc": "p.price DESC",
        "rating_asc": "p.rating ASC",
        "rating_desc": "p.rating DESC",
    }

    order_by = orders.get(by, "p.id ASC")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(f"""
        SELECT 
            p.id, p.title, p.price, p.thumbnail, p.rating,
            p.category_id, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY {order_by}
        LIMIT %s OFFSET %s
    """, (limit, offset))

    rows = cursor.fetchall()

    return {
        "sort": by,
        "limit": limit,
        "offset": offset,
        "nextOffset": offset + limit,
        "data": rows
    }


# ======================
# /login
# ======================
@app.post("/login")
async def login(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s LIMIT 1", (email,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    if password != user["password"]:
        return {"error": "Wrong password"}

    return {
        "message": "Login success",
        "user": user,
        "token": f"fake-jwt-token-{user['id']}"
    }


# ======================
# /adduser
# ======================
@app.post("/adduser")
async def add_user(request: Request):
    body = await request.json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")
    phone = body.get("phone")
    role = "user"

    if not username or not email or not password:
        return {"error": "username, email və password tələb olunur"}

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    exists = cursor.fetchone()

    if exists:
        return {"error": "Bu email artıq istifadə olunur"}

    cursor.execute("""
        INSERT INTO users (username, email, password, phone, role)
        VALUES (%s, %s, %s, %s, %s)
    """, (username, email, password, phone, role))

    conn.commit()

    return {"success": True, "message": "User əlavə edildi"}


# ======================
# /basket/add
# ======================
@app.post("/basket/add")
async def add_basket(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    product_id = body.get("product_id")
    quantity = body.get("quantity") or 1

    if not user_id or not product_id:
        return {"error": "user_id və product_id tələb olunur"}

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, quantity
        FROM basket_items
        WHERE user_id=%s AND product_id=%s
    """, (user_id, product_id))

    existing = cursor.fetchone()

    # məhsul varsa → quantity artır
    if existing:
        new_qty = existing["quantity"] + quantity
        cursor.execute("""
            UPDATE basket_items
            SET quantity=%s
            WHERE id=%s
        """, (new_qty, existing["id"]))
        conn.commit()

        return {
            "message": "Məhsul səbətdə idi → miqdar artırıldı",
            "quantity": new_qty
        }

    # məhsul səbətdə yoxdursa
    cursor.execute("""
        INSERT INTO basket_items (user_id, product_id, quantity)
        VALUES (%s, %s, %s)
    """, (user_id, product_id, quantity))

    conn.commit()

    return {"message": "Məhsul səbətə əlavə edildi"}


# ======================
# CRON — Hər 1 saatdan bir ETL
# ======================
def cron_task():
    while True:
        print("⏳ ETL başladı...")
        sync_categories()
        print("✔ ETL tamamlandı")
        import time
        time.sleep(3600)  # 1 saat


threading.Thread(target=cron_task, daemon=True).start()

