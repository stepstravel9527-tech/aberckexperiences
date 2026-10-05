import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        // 使用 Mongoose 内置状态检查
        if (mongoose.connection.readyState === 1) {
            return; // 已经连接
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DATABASE_NAME,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ Connected to database: ${process.env.DATABASE_NAME}`);

    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};