module.exports = (sequelize, DataTypes) => {
  const EmployeeShift = sequelize.define('EmployeeShift', {
    employee_id: { type: DataTypes.UUID },
    day_of_week: { type: DataTypes.STRING },
    shift_start_time: { type: DataTypes.TIME },
    shift_end_time: { type: DataTypes.TIME },
    is_active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }  // ✅ include in model definition
  }, {
    tableName: 'employeeshifts',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return EmployeeShift;
};
