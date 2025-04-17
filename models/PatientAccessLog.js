module.exports = (sequelize, DataTypes) => {
  const PatientAccessLog = sequelize.define('PatientAccessLog', {
    user_id: { type: DataTypes.UUID },
    patient_id: { type: DataTypes.UUID },
    access_type: { type: DataTypes.STRING },
    override_used: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patientaccesslogs',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return PatientAccessLog;
};
