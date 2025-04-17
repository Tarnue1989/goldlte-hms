const sequelize = require('./config/db');
const Role = require('./models/Role');

const seedRoles = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB for seeding...');

    const roles = ['Admin', 'Employee', 'Patient'];

    for (const roleName of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { role_name: roleName },
        defaults: { role_name: roleName }
      });

      if (created) {
        console.log(`✅ Role "${roleName}" created.`);
      } else {
        console.log(`⚠️ Role "${roleName}" already exists.`);
      }
    }

    console.log('🌱 Role seeding complete.');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding roles:', err);
    process.exit(1);
  }
};

seedRoles();
