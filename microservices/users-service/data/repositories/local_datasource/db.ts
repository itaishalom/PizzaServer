import mongoose from 'mongoose';
// @ts-ignore
import dotenv from 'dotenv';
import config from "../../../config";

dotenv.config();

const db = async (): Promise<void> => {
    try {
        await mongoose.connect(config.DATABASE_URL);
        console.log('db connected');
    } catch (error) {
        console.error(error);
    }
};

export default db;
