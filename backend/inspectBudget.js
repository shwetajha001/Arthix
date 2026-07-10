import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/User.js';
import Budget from './models/Budget.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}).limit(20).lean();
  console.log('users', users.length);
  for (const u of users) {
    const b = await Budget.findOne({ user: u._id }).lean();
    console.log(JSON.stringify({ email: u.email, id: u._id.toString(), budget: b ? b.monthlyBudget : null }, null, 2));
  }
  await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });
