

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Create the Express application
const app = express();
app.use(cors());
// Configure JSON body parser
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Configure file upload using Multer
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://<username>:<password>@mydbcloud.tztsqmz.mongodb.net/mydb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const reviewSchema = new mongoose.Schema({
  review: String,
  starRating: Number,
});
// Define the MongoDB schema and model
const productSchema = new mongoose.Schema({
  partNumber: String,
  name: String,
  actualPrice: Number,
  discountedPrice: Number,
  topRated: Boolean,
  specialOffer: Boolean,
  bestSeller: Boolean,
  image: String,
  reviews: [reviewSchema],
});

const Product = mongoose.model("Product", productSchema);

// Define the RESTful API routes
// GET all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a specific product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new product with image upload
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const {
      partNumber,
      name,
      actualPrice,
      discountedPrice,
      topRated,
      specialOffer,
      bestSeller,
    } = req.body;
    const product = new Product({
      partNumber,
      name,
      actualPrice,
      discountedPrice,
      topRated,
      specialOffer,
      bestSeller,
      image: req.file ? req.file.path : "",
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// POST a new review for a product
app.post("/products/:id/reviews", async (req, res) => {
  try {
    const { review, starRating } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.reviews.push({ review, starRating });
      await product.save();
      res.status(201).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// PUT (update) a product by ID
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
