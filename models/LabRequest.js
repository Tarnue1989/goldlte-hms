module.exports = (sequelize, DataTypes) => {
  const LabRequest = sequelize.define('LabRequest', {
    consultation_id: { type: DataTypes.UUID },
    test_name: { type: DataTypes.STRING },
    patient_id: { type: DataTypes.UUID },
    status: { type: DataTypes.STRING },
    requested_by: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE } 
  }, {
    tableName: 'labrequests',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return LabRequest;
};
