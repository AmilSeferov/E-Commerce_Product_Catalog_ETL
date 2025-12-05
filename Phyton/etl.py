import requests
from db import get_connection
from datetime import datetime

def sync_categories():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # ===============================
        # 1) KATEQORİYALARI API-DƏN ÇƏK
        # ===============================
        print("Kateqoriyalar yüklənir...")

        res = requests.get("https://dummyjson.com/products/categories")
        categories = res.json()

        for cat in categories:
            name = cat.get("name") if isinstance(cat, dict) else cat  # bəzi hallarda string gəlir

            cursor.execute("SELECT id FROM categories WHERE name=%s", (name,))
            row = cursor.fetchone()

            if not row:
                cursor.execute(
                    "INSERT INTO categories (name) VALUES (%s)",
                    (name,)
                )
                print(f"Yeni kateqoriya əlavə edildi: {name}")
            else:
                print(f"Artıq mövcuddur: {name}")

        conn.commit()

        # ===============================
        # 2) MƏHSULLARI API-DƏN ÇƏK
        # ===============================
        print("Məhsullar yüklənir...")

        res = requests.get("https://dummyjson.com/products?limit=0")
        products = res.json().get("products", [])

        for product in products:

            # 2.1) Category_id tap
            cursor.execute(
                "SELECT id FROM categories WHERE name=%s",
                (product["category"],)
            )
            cat_row = cursor.fetchone()
            category_id = cat_row[0] if cat_row else None

            # 2.2) Product mövcuddur?
            cursor.execute(
                "SELECT id FROM products WHERE id=%s",
                (product["id"],)
            )
            prod_exists = cursor.fetchone()

            if prod_exists:
                print(f"Artıq mövcuddur: {product['title']}")
                continue

            # 2.3) INSERT PRODUCT
            cursor.execute(
                """
                INSERT INTO products 
                (id, title, description, category_id, price, discountPercentage, 
                 rating, stock, brand, weight, warrantyInformation, createdAt, 
                 updatedAt, thumbnail)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    product["id"],
                    product["title"],
                    product.get("description"),
                    category_id,
                    product["price"],
                    product.get("discountPercentage"),
                    product.get("rating"),
                    product.get("stock"),
                    product.get("brand"),
                    product.get("weight"),
                    product.get("warrantyInformation"),
                    datetime.now(),
                    datetime.now(),
                    product.get("thumbnail")
                )
            )

            print(f"Yeni məhsul əlavə edildi: {product['title']}")

            # 2.4) INSERT product_dimensions
            if product.get("dimensions"):
                dims = product["dimensions"]
                cursor.execute(
                    """
                    INSERT INTO product_dimensions (product_id, width, height, depth)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (
                        product["id"],
                        dims.get("width"),
                        dims.get("height"),
                        dims.get("depth")
                    )
                )
                print(f"Dimensions əlavə edildi: {product['title']}")

            # 2.5) INSERT product_images
            if product.get("images"):
                for img in product["images"]:
                    cursor.execute(
                        """
                        INSERT INTO product_images (product_id, image_url)
                        VALUES (%s, %s)
                        """,
                        (product["id"], img)
                    )

                print(f"Şəkillər əlavə edildi: {product['title']}")

        conn.commit()
        print("Sinxronizasiya tamamlandı.")

    except Exception as e:
        print("ETL ERROR:", e)

    finally:
        cursor.close()
        conn.close()
