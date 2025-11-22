
const axios = require("axios");
const db = require("./db");

function syncCategories(callback) {
  // 1) API-dən kateqoriyaları al
  axios.get("https://dummyjson.com/products/categories")
    .then(response => {
      const categories = response.data;
      categories.forEach(cat => {
        console.log(cat.name); 
        console.log(cat.name); 
        // 2) kateqoriya cədvəldə varmı?
        db.query(
          "SELECT id FROM categories WHERE name = ?",
          [cat.name],
          (err, rows) => {
            if (err) {
              console.log("SELECT səhv:", err);
              return;
            }
            if (rows.length === 0) {
              // 3) kateqoriya yoxdursa əlavə et
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
    
}
syncCategories();
module.exports = { syncCategories };