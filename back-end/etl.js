
const axios = require("axios");
const db = require("./db");

function syncCategories(callback) {
  // 1) API-dən kateqoriyaları al



  axios.get("https://dummyjson.com/products/categories")
  .then(response => {
      const categories = response.data;
      categories.forEach(cat => {
        console.log(cat.name);

        // 1.1) kateqoriya cədvəldə varmı?
        db.query(
          "SELECT id FROM categories WHERE name = ?",
          [cat.name],
          (err, rows) => {
            if (err) {
              console.log("SELECT səhv:", err);
              return;
            }
            if (rows.length === 0) {
              // 1.2) kateqoriya yoxdursa əlavə et
              db.query(
                "INSERT INTO categories (name) VALUES (?)",
                [cat.name],
                (insertErr) => {
                  if (insertErr) {
                    console.log("INSERT səhv:", insertErr);
                  } else {
                    console.log(`Yeni kateqoriya əlavə edildi: ${cat}`);
                  }
                }
              );
            } else {
              console.log(`Artıq mövcuddur: ${cat.name}`);
            }
          }
        );
      });
      if (callback) callback(null, { message: "Kateqoriyalar yeniləndi" });
    })
    .catch(error => {
      console.log("Xəta:", error);
      if (callback) callback(error);
    });


  // 2) Məhsulları API-dən al və sinxronizasiya et
  axios.get("https://dummyjson.com/products?limit=0")
    .then(response => {
      const products = response.data.products;

      products.forEach(product => {

        // 2.1) Category_id tap
        db.query(
          "SELECT id FROM categories WHERE name = ?",
          [product.category],
          (catErr, catRows) => {
            if (catErr) {
              console.log("Category error:", catErr);
              return;
            }

            const categoryId = catRows.length ? catRows[0].id : null;

            // 2.2) Product varmı?
            db.query(
              "SELECT id FROM products WHERE id = ?",
              [product.id],
              (err, rows) => {
                if (err) {
                  console.log("Product SELECT error:", err);
                  return;
                }

                if (rows.length > 0) {
                  console.log(`Artıq mövcuddur: ${product.title}`);
                  return;
                }

                // 2.3) INSERT product
                db.query(
                  `INSERT INTO products 
                  (id, title, description, category_id, price, discountPercentage, rating, stock, brand,
                   weight, warrantyInformation, createdAt, updatedAt, thumbnail)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    product.id,
                    product.title,
                    product.description,
                    categoryId,
                    product.price,
                    product.discountPercentage,
                    product.rating,
                    product.stock,
                    product.brand,
                    product.weight,
                    product.warrantyInformation || null,
                    new Date(),
                    new Date(),
                    product.thumbnail
                  ],
                  (insertErr) => {
                    if (insertErr) {
                      console.log("Product INSERT error:", insertErr);
                      return;
                    }

                    console.log(`Yeni məhsul əlavə edildi: ${product.title}`);

                    // ===============================
                    // 2.4) INSERT product_dimensions
                    // ===============================

                    if (product.dimensions) {
                      db.query(
                        `INSERT INTO product_dimensions (product_id, width, height, depth)
                         VALUES (?, ?, ?, ?)`,
                        [
                          product.id,
                          product.dimensions.width,
                          product.dimensions.height,
                          product.dimensions.depth
                        ],
                        (dimErr) => {
                          if (dimErr) {
                            console.log("Dimensions INSERT error:", dimErr);
                          } else {
                            console.log(`Dimensions əlavə edildi: ${product.title}`);
                          }
                        }
                      );
                    }

                    // ===============================
                    // = 2.5) INSERT product_images  =
                    // ===============================

                    if (product.images && product.images.length > 0) {
                      product.images.forEach(img => {
                        db.query(
                          `INSERT INTO product_images (product_id, image_url)
                           VALUES (?, ?)`,
                          [product.id, img],
                          (imgErr) => {
                            if (imgErr) {
                              console.log("Image INSERT error:", imgErr);
                            }
                          }
                        );
                      });

                      console.log(`Şəkillər əlavə edildi: ${product.title}`);
                    }
                  }
                );
              }
            );
          }
        );
      });

      console.log("Sinxronizasiya davam edir...");
    })
    .catch(error => {
      console.log("API ERROR:", error);
    });

}

module.exports = { syncCategories };