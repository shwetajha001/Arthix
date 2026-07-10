import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/User.js';
import Budget from './models/Budget.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const budgets = await Budget.find({ monthlyBudget: { $gt: 0 } }).limit(20).populate('user').lean();
  console.log('budgets', budgets.length);
  for (const b of budgets) {
    console.log(JSON.stringify({ email: b.user?.email, userId: b.user?._id?.toString(), budget: b.monthlyBudget }, null, 2));
  }
  await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });
