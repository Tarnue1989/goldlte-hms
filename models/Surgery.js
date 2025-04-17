module.exports = (sequelize, DataTypes) => {
  const Surgery = sequelize.define('Surgery', {
    patient_id: { type: DataTypes.UUID },
    surgeon_id: { type: DataTypes.UUID },
    scheduled_date: { type: DataTypes.DATE },
    operating_room: { type: DataTypes.STRING },
    surgery_type: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'), defaultValue: 'Scheduled' },
    notes: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'surgeries',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return Surgery;
};
