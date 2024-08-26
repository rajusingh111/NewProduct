const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("./uploads"));
app.use("/useruploads", express.static("./userUploads"));
app.use(
  "/productuploads",
  express.static(path.join(__dirname, "productUploads"))
);

// Database connection
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "product",
  password: "password",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("Db connected"))
  .catch((e) => console.log("Db connection Failed!", "\n", e));

// Image storage configuration
var imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./productUploads");
  },
  filename: (req, file, callback) => {
    const uniqueId = Date.now();
    const fileName = `image-${uniqueId}.${file.originalname}`;
    callback(null, fileName);
  },
});

// Image filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

// Image upload middleware
var upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

// API routes

// Create a new category
app.post("/categories", async (req, res) => {
  const { name, isActive } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Category (Name, IsActive) VALUES ($1, $2) RETURNING *",
      [name, isActive]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
app.post("/products", upload.single("photo"), async (req, res) => {
  const { categoryid, name, price, description, isActive } = req.body;
  console.log("hellow", req.body);
  const photo = req.file.filename; // Use the uploaded filename
  try {
    const result = await client.query(
      "INSERT INTO Product (CategoryID, Name, Price, Description, Photo, IsActive) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [categoryid, name, price, description, photo, isActive]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all active products
app.get("/products", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM Product WHERE IsActive = TRUE"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload an image
app.post("/image", upload.single("avatar"), function (req, res) {
  const newPath = path.join(__dirname, "uploads", req.file.filename);
  fs.rename(req.file.path, newPath, (err) => {
    if (err) {
      return res.status(500).json({ error: "File rename failed" });
    }
    imageDB.push(req.file.filename);
    res.send(`<img width="50%" src='/uploads/${req.file.filename}'></img>`);
  });
});

// Get all uploaded images
app.get("/images", (req, res) => {
  let html = "";
  imageDB.forEach((image) => {
    html += `<img src='/uploads/${image}'></img>`;
  });
  res.send(html);
});

// Update a product by ID
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { categoryID, name, price, description, isActive } = req.body;
  const photo = req.file?.filename || req.body.photo; // Optional photo update
  try {
    const result = await client.query(
      "UPDATE Product SET CategoryID = $1, Name = $2, Price = $3, Description = $4, Photo = $5, IsActive = $6 WHERE ProductID = $7 RETURNING *",
      [categoryID, name, price, description, photo, isActive, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product by ID
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM Product WHERE ProductID = $1", [id]);
    res.status(200).send(`Product deleted with ID: ${id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Category");
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
