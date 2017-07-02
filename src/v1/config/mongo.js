import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Promise from 'bluebird';

dotenv.config();

const { MONGO_URL } = process.env;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

export default mongoose;
