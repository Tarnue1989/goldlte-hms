const bcrypt = require('bcryptjs');
const { User, Role, sequelize } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB for user seeding...');

    const adminRole = await Role.findOne({ where: { role_name: 'Admin' } });
    if (!adminRole) throw new Error('Admin role not found. Please seed roles first.');

    const existing = await User.findOne({ where: { email: 'admin@example.com' } });

    if (existing) {
      console.warn('⚠️ Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await User.create({
        full_name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role_id: adminRole.id,
        must_change_password: true,
        created_by: null // You can set this to an actual user later
      });

      console.log('✅ Admin user created.');
    }

    console.log('🌱 User seeding complete.');
    process.exit();
  } catch (err) {
    console.error('❌ Error during user seeding:', err.message);
    process.exit(1);
  }
})();
