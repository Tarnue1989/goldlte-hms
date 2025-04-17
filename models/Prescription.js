module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define('Prescription', {
    consultation_id: { type: DataTypes.UUID },
    patient_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    medication_id: { type: DataTypes.UUID },
    dosage: { type: DataTypes.STRING },
    instructions: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING },
    fulfilled_by: { type: DataTypes.UUID },
    fulfilled_at: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'prescriptions',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Prescription;
};
