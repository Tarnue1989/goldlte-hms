module.exports = (sequelize, DataTypes) => {
  const PatientHistory = sequelize.define('PatientHistory', {
    patient_id: { type: DataTypes.UUID },
    history_type: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    recorded_by: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patienthistorys',   // Matches the existing table name in your DB
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return PatientHistory;
};
