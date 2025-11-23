const express= require('express');
const cors= require('cors')
const app=express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const connection = require('./db');
  // app.get('/products',(req,res)=>{
  //   connection.query('SELECT *  FROM products;',(err,data)=>{
  //     if(!err){
  //       res.status(200).json(data)
  //     }else{
  //       res.status(404).json('error')
  //       console.log('erorr')
  //     }
  //   })
  // })
  // app.get('/categories',(req,res)=>{
  //   connection.query('SELECT * FROM categories',(err,data)=>{
  //     if(!err){
  //       res.status(200).json(data)
  //     }else{
  //       res.status(404).json('error')
  //       console.log('erorr')
  //     }
  //   })
  // })
  
app.get('/products', (req, res) => {
  const limit  = parseInt(req.query.limit)  || 20;
  const offset = parseInt(req.query.offset) || 0;

  const sql = `
    SELECT id, title, price, thumbnail, rating
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
app.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q || q.trim() === "") {
    return res.json({ data: [] });
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
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 
      p.title LIKE ?
      OR p.description LIKE ?
      OR p.brand LIKE ?
    ORDER BY p.id DESC
    LIMIT 100
  `;

  connection.query(sql, [keyword, keyword, keyword], (err, rows) => {
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


  app.listen(2000, (err) => {
    if (!err) {
        console.log('Server is going on')
    }
})