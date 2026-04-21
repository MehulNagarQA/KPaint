import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected to MongoDB for seeding');

    const adminEmail = 'admin@kpaint.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      process.exit(0);
    }

    const adminUser = new User({
      name: 'KPaint Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@kpaint.com');
    console.log('   Password: Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
