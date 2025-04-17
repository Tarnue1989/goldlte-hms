module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    account_status: {
      type: DataTypes.ENUM('Active', 'Disabled'),
      defaultValue: 'Active'
    },
    must_change_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_at',
    tableName: 'Users' // Matches your DB table exactly
  });

  // Associations
  User.associate = models => {
    User.belongsTo(models.Role, { foreignKey: 'role_id' });
    User.belongsTo(models.Department, { foreignKey: 'department_id' });
    User.belongsTo(models.Employee, { foreignKey: 'employee_id' });
  };

  return User;
};
