module.exports = (sequelize, DataTypes) => {
  const PatientAllergy = sequelize.define('PatientAllergy', {
    patient_id: { type: DataTypes.UUID },
    allergen: { type: DataTypes.STRING },
    reaction: { type: DataTypes.STRING },
    severity: { type: DataTypes.STRING },
    recorded_by: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patientallergys',  // Matches existing DB table name
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return PatientAllergy;
};
