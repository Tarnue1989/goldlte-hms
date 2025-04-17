module.exports = (sequelize, DataTypes) => {
  const PatientInsurance = sequelize.define('PatientInsurance', {
    patient_id: { type: DataTypes.UUID },
    provider_id: { type: DataTypes.UUID },
    policy_number: { type: DataTypes.STRING },
    expiry_date: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patientinsurances',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return PatientInsurance;
};
