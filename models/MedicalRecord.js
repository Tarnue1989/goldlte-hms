module.exports = (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define('MedicalRecord', {
    patient_id: { type: DataTypes.UUID },
    consultation_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    cc: { type: DataTypes.TEXT },
    hpi: { type: DataTypes.TEXT },
    dx: { type: DataTypes.STRING },
    lab_inv: { type: DataTypes.TEXT },
    img_inv: { type: DataTypes.TEXT },
    tx_mx: { type: DataTypes.TEXT },
    summary_pg: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'medicalrecords',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return MedicalRecord;
};
