import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !deliveryAddress?.trim()) {
      return res.status(400).json({ message: "Add items and a delivery address." });
    }
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      if (!product) return res.status(400).json({ message: "One of the products is unavailable." });
      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity });
    }
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user.id, items: orderItems, total, deliveryAddress: deliveryAddress.trim()
    });
    res.status(201).json({ message: "Demo order placed successfully!", order });
  } catch {
    res.status(500).json({ message: "Could not place order." });
  }
});

router.get("/mine", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
