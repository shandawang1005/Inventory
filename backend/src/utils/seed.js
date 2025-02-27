require('dotenv').config({ path: './backend/.env' });

const mongoose = require("mongoose")

const Product = require("../models/Product")
const Supplier = require("../models/Supplier")
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(e => console.error(e))

const seedDB = async () => {
    // 清空数据库
    await Product.deleteMany();
    await Supplier.deleteMany();
    const supplier = await Supplier.create({
        name: "Supplier A",
        contact: "supplier@example.com",
        phone: "+123456789",
        address: "123 Street, City, Country"
    });
    // 创建产品
    await Product.create([
        {
            name: "Laptop",
            category: "Electronics",
            description: "Gaming Laptop",
            price: 1200.00,
            stock: 10,
            supplier: supplier._id,
            attributes: { RAM: "16GB", CPU: "Intel i7", Storage: "512GB SSD" }
        },
        {
            name: "Phone",
            category: "Electronics",
            description: "Smartphone",
            price: 800.00,
            stock: 20,
            supplier: supplier._id,
            attributes: { Screen: "6.5 inch", Battery: "4000mAh" }
        }

    ])
    console.log("Database seeded!");
    mongoose.connection.close();
}
seedDB();