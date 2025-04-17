module.exports = (sequelize, DataTypes) => {
  const EKGRecord = sequelize.define('EKGRecord', {
    patient_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    heart_rate: { type: DataTypes.STRING },
    pr_interval: { type: DataTypes.STRING },
    qrs_duration: { type: DataTypes.STRING },
    qt_interval: { type: DataTypes.STRING },
    rhythm: { type: DataTypes.STRING },
    interpretation: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'ekgrecords',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return EKGRecord;
};
