import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
dotenv.config();

const products = [
  { name: "Linen Day Dress", category: "Clothing", price: 1899, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900", description: "An effortless linen-blend dress for slow, sunny days.", featured: true },
  { name: "Everyday Tote", category: "Accessories", price: 999, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900", description: "A roomy everyday carryall with a clean silhouette.", featured: true },
  { name: "Classic Knit Top", category: "Clothing", price: 1299, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900", description: "A soft, versatile knit designed for easy layering." },
  { name: "Minimal Gold Earrings", category: "Accessories", price: 799, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900", description: "Subtle gold-tone accents for everyday styling." },
  { name: "Relaxed Cotton Shirt", category: "Clothing", price: 1599, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900", description: "A relaxed-fit cotton shirt with timeless appeal." },
  { name: "Soft Shoulder Bag", category: "Accessories", price: 2199, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900", description: "A polished shoulder bag for day-to-evening plans." },
  { name: "Weekend Sneakers", category: "Footwear", price: 2499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900", description: "Comfort-first sneakers for everyday adventures." },
  { name: "Strap Sandals", category: "Footwear", price: 1799, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900", description: "Minimal sandals that pair with everything." }
];

try {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Sample products added.");
} catch (error) {
  console.error(error.message);
} finally {
  await mongoose.disconnect();
}
