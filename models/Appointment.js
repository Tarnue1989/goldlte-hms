module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    patient_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    department_id: { type: DataTypes.UUID },
    date_time: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'appointments',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Appointment;
};
