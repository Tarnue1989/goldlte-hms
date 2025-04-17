module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'department_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    head_of_department_id: {
      type: DataTypes.UUID,
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
    timestamps: true,
    tableName: 'Departments',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  // 🔗 Define association with Employee (as head_of_department)
  Department.associate = models => {
    Department.belongsTo(models.Employee, {
      foreignKey: 'head_of_department_id',
      as: 'head_of_department'
    });
  };

  return Department;
};
