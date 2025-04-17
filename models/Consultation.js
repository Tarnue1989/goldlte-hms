module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define('Consultation', {
    appointment_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    diagnosis: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'consultations',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Consultation;
};
