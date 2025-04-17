module.exports = (sequelize, DataTypes) => {
  const PatientFile = sequelize.define('PatientFile', {
    patient_id: { type: DataTypes.UUID },
    file_type: { type: DataTypes.STRING },
    file_path: { type: DataTypes.STRING },
    uploaded_by: { type: DataTypes.UUID },
    uploaded_at: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patientfiles',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return PatientFile;
};
