module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    prefix: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true },
    },
    address: {
      type: DataTypes.TEXT,
    },
    emergency_contact_name: {
      type: DataTypes.STRING(100),
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
    },
    department_id: {
      type: DataTypes.UUID,
    },
    role_id: {
      type: DataTypes.UUID,
    },
    position_title: {
      type: DataTypes.STRING(100),
    },
    employment_status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'On Leave', 'Terminated'),
      defaultValue: 'Active',
    },
    start_date: {
      type: DataTypes.DATEONLY,
    },
    end_date: {
      type: DataTypes.DATEONLY,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    resume_url: {
      type: DataTypes.STRING,
    },
    linkedin_url: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    created_by: {
      type: DataTypes.UUID,
    },
    updated_by: {
      type: DataTypes.UUID,
    },
    deleted_by: {
      type: DataTypes.UUID,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    tableName: 'Employees',
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  // 🧠 Virtual full name
  Employee.prototype.toJSON = function () {
    const values = { ...this.get() };
    const parts = [values.prefix, values.first_name, values.middle_name, values.last_name].filter(Boolean);
    values.full_name = parts.join(' ').trim();
    return values;
  };

  // 🔗 Add associations
  Employee.associate = models => {
    Employee.belongsTo(models.Role, { foreignKey: 'role_id' });
    Employee.belongsTo(models.Department, { foreignKey: 'department_id' });
  };

  return Employee;
};
