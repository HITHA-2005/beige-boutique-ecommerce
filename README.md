# Beige Boutique — Full-Stack E-Commerce

A beginner-friendly portfolio project built with React, Node.js, Express and MongoDB.

## Features
- Responsive fashion storefront
- Product search and category filters
- Product detail modal
- Add/remove items and quantity controls in cart
- Cart persists in browser localStorage
- Register/login with JWT authentication
- Checkout creates an order in MongoDB
- Seed script adds sample products

> This is a learning/demo project. It does not process real payments. The checkout records a demo order only.

## Requirements
- Node.js 18+
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- VS Code

## 1. Install dependencies
Open this project folder in VS Code. In the terminal, run:

```bash
npm install
npm run install:all
```

## 2. Configure the server
Inside `server`, copy `.env.example` to `.env` and set your MongoDB connection string and a private JWT secret.

Example:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/beige_boutique
JWT_SECRET=replace_this_with_a_long_random_secret
```

## 3. Add sample products
Make sure MongoDB is running, then run from the project root:

```bash
npm run seed
```

## 4. Start the website
From the project root:

```bash
npm run dev
```

Open the Vite address shown in the terminal (usually http://localhost:5173).
The API runs at http://localhost:5000.

## Folder structure
- `client/` — React frontend
- `server/` — Express API, MongoDB models and seed script

## Useful portfolio description
Built a responsive full-stack e-commerce application using React, Node.js, Express and MongoDB, featuring product discovery, search and category filtering, persistent shopping cart, JWT-based authentication and demo order management.

## Before publishing to GitHub
- Never upload `.env`.
- Keep `.env.example` in the repository.
- Add screenshots to the README after you run the project.
- Do not claim real payment processing; this version uses demo checkout.
