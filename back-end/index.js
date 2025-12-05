const express= require('express');
const cors= require('cors')
const app=express();
const cron = require("node-cron");
const { syncCategories } = require("./etl"); 
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const connection = require('./db');

// Lazy load endpoint
app.get('/products', (req, res) => {
  const limit  = parseInt(req.query.limit)  || 20;
  const offset = parseInt(req.query.offset) || 0;

  const sql = `
    SELECT id, title, price, thumbnail, rating,discountPercentage
    FROM products
    ORDER BY id
    LIMIT ? OFFSET ?
  `;

  connection.query(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Lazy load error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      data: rows,
      nextOffset: offset + limit,
      limit
    });
  });
});
// Product details endpoint
app.get('/product/:id', (req, res) => {
  const productId = req.params.id;

  // 1) Əsas məhsul məlumatı
  const productSql = `
    SELECT *
    FROM products
    WHERE id = ?
  `;

  connection.query(productSql, [productId], (err, productRows) => {
    if (err) {
      console.error("Product query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productRows[0];

    // 2) Dimensions məlumatı
    const dimSql = `
      SELECT width, height, depth
      FROM product_dimensions
      WHERE product_id = ?
    `;

    connection.query(dimSql, [productId], (err, dimRows) => {
      if (err) {
        console.error("Dimension query error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const dimensions = dimRows.length > 0 ? dimRows[0] : null;

      // 3) Şəkillər
      const imgSql = `
        SELECT image_url
        FROM product_images
        WHERE product_id = ?
      `;

      connection.query(imgSql, [productId], (err, imgRows) => {
        if (err) {
          console.error("Images query error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Cavabı birləşdiririk
        res.json({
          ...product,
          dimensions: dimensions,
          images: imgRows
        });
      });
    });
  });
});
// Categories endpoint  
app.get('/categories', (req, res) => {
  const sql = `
    SELECT id, name
    FROM categories
    ORDER BY name ASC
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error("Categories error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      categories: rows
    });
  });
});
// Products by category endpoint
app.get('/products/category/:id', (req, res) => {
  const categoryId = req.params.id;
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const sql = `
    SELECT 
      p.id,
      p.title,
      p.price,
      p.thumbnail,
      p.rating,
      p.category_id,
      p.discountPercentage,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ?
    ORDER BY p.id ASC
    LIMIT ? OFFSET ?
  `;

  connection.query(sql, [categoryId, limit, offset], (err, rows) => {
    if (err) {
      console.error("Category products error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      category_id: categoryId,
      count: rows.length,
      data: rows,
      nextOffset: offset + limit
    });
  });
});
// Search endpoint
app.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q || q.trim() === "") {
    return res.json({
      query: "",
      results: []
    });
  }

  const keyword = `%${q}%`;

  const sql = `
    SELECT 
      p.id,
      p.title,
      p.price,
      p.thumbnail,
      p.rating,
      p.brand,
      p.category_id,
      p.discountPercentage,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 
      p.title LIKE ?
      OR p.description LIKE ?
      OR p.brand LIKE ?
      OR c.name LIKE ?              
    ORDER BY p.id DESC
    LIMIT 200
  `;

  connection.query(sql, [keyword, keyword, keyword, keyword], (err, rows) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      query: q,
      results: rows
    });
  });
});
// Sort endpoint
app.get('/products/sort', (req, res) => {
  const sortBy = req.query.by;
  const limit  = parseInt(req.query.limit)  || 20;
  const offset = parseInt(req.query.offset) || 0;

  let orderBy = "";

  switch (sortBy) {
    case "price_asc":
      orderBy = "p.price ASC";
      break;
    case "price_desc":
      orderBy = "p.price DESC";
      break;
    case "rating_asc":
      orderBy = "p.rating ASC";
      break;
    case "rating_desc":
      orderBy = "p.rating DESC";
      break;
    default:
      orderBy = "p.id ASC"; // default sort
  }

  const sql = `
    SELECT 
      p.id,
      p.title,
      p.price,
      p.thumbnail,
      p.rating,
      p.category_id,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  connection.query(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Sort error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      sort: sortBy,
      limit,
      offset,
      nextOffset: offset + limit,
      data: rows
    });
  });
});
// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;

  connection.query(sql, [email], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.json({
      message: "Login success",
      user,
      token: "fake-jwt-token-" + user.id
    });
  });
});
// add user endpoint
app.post('/adduser', (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email və password tələb olunur" });
  }

  // 👉 İstifadəçinin rolu dəyişdirilə bilməz
  const role = "user";

  // 1) Email mövcuddurmu?
  const checkSql = `SELECT * FROM users WHERE email = ?`;

  connection.query(checkSql, [email], (err, rows) => {
    if (err) {
      console.error("Email check error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (rows.length > 0) {
      return res.status(400).json({ error: "Bu email artıq istifadə olunur" });
    }

    // 2) Şifrə TEXT olaraq yazılır
    const insertSql = `
      INSERT INTO users (username, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
      insertSql,
      [username, email, password, phone, role],
      (err, result) => {
        if (err) {
          console.error("Add user insert error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({
          success: true,
          message: "User uğurla əlavə edildi",
          userId: result.insertId,
          assignedRole: role
        });
      }
    );
  });
});
// Add to basket endpoint
app.post('/basket/add', (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: "user_id və product_id tələb olunur" });
  }

  const qty = quantity || 1;

  // Əvvəl baxırıq bu məhsul istifadəçinin səbətində VARMI?
  const checkSql = `
    SELECT id, quantity
    FROM basket_items
    WHERE user_id = ? AND product_id = ?
  `;

  connection.query(checkSql, [user_id, product_id], (err, rows) => {
    if (err) {
      console.error("Check basket error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Məhsul artıq səbətdə varsa → quantity artırırıq
    if (rows.length > 0) {
      const item = rows[0];
      const newQty = item.quantity + qty;

      const updateSql = `
        UPDATE basket_items
        SET quantity = ?
        WHERE id = ?
      `;

      return connection.query(updateSql, [newQty, item.id], (err2) => {
        if (err2) {
          console.error("Update basket error:", err2);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.json({
          message: "Məhsul səbətdə idi → miqdar artırıldı",
          quantity: newQty
        });
      });
    }

    // Məhsul səbətdə yoxdursa → yeni əlavə edilir
    const insertSql = `
      INSERT INTO basket_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `;

    connection.query(insertSql, [user_id, product_id, qty], (err3, result) => {
      if (err3) {
        console.error("Add basket error:", err3);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({
        message: "Məhsul səbətə əlavə edildi",
        basket_item_id: result.insertId,
        quantity: qty
      });
    });
  });
});
// Add to favorites endpoint
app.post("/favorites/add", (req, res) => {
  const { user_id, product_id } = req.body;

  const sql = `
    INSERT INTO favorites (user_id, product_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE user_id = user_id
  `;

  connection.query(sql, [user_id, product_id], (err) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });

    res.json({ message: "Favoritə əlavə olundu" });
  });
});
// Remove from favorites endpoint
app.delete("/favorites/remove", (req, res) => {
  const { user_id, product_id } = req.body;

  const sql = `DELETE FROM favorites WHERE user_id = ? AND product_id = ?`;

  connection.query(sql, [user_id, product_id], (err) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });

    res.json({ message: "Favoritdən çıxarıldı" });
  });
});
// Check favorite endpoint
app.get("/favorites/check/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;

  const sql = `SELECT * FROM favorites WHERE user_id = ? AND product_id = ?`;

  connection.query(sql, [userId, productId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json({ isFavorite: rows.length > 0 });
  });
});
// Get user's favorites endpoint
app.get("/favorites/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT products.*
    FROM favorites
    JOIN products ON favorites.product_id = products.id
    WHERE favorites.user_id = ?
  `;

  connection.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ favorites: rows });
  });
});



// Hər 1 saatdan bir işləsin
cron.schedule("0 * * * *", () => {
  console.log("⏳ ETL başladı (CRON)...");
  syncCategories(() => {
    console.log("✔ ETL tamamlandı");
  });
});

// Server başlatma
  app.listen(2000, (err) => {
    if (!err) {
        console.log('Server is going on')
    }
})