import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Could not load products." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product ID." });
  }
});

export default router;
