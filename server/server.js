import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
const port = 3001;

// Cho phép CORS từ phía frontend
app.use(cors());
// Sử dụng body-parser để parse JSON
app.use(bodyParser.json());

// Tạo adapter cho file db.json
const adapter = new JSONFile("./db.json");

// Tạo instance của lowdb với dữ liệu mặc định { users: [] }
const db = new Low(adapter, { users: [] });

async function initDB() {
    await db.read();
    // Nếu file db.json trống, gán giá trị mặc định
    db.data = db.data || { users: [] };
}

await initDB();

// Endpoint đăng nhập
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    await db.read();
    const user = db.data.users.find(
        (u) => u.username === username && u.password === password
    );
    if (user) {
        return res.json({ success: true, user });
    } else {
        return res.status(401).json({
            success: false,
            message: "Sai tài khoản hoặc mật khẩu",
        });
    }
});
app.get("/api/products", async (req, res) => {
    await db.read();
    return res.json({ success: true, products: db.data.products });
});
app.get("/api/products/:id", async (req, res) => {
    await db.read();
    const { id } = req.params;
    const product = db.data.products.find((p) => p.id === parseInt(id));
    if (product) {
        return res.json({ success: true, product });
    } else {
        return res.status(404).json({ success: false, message: "Sản phẩm khóa" });
    }
});
    
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
