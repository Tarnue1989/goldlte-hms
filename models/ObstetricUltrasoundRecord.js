module.exports = (sequelize, DataTypes) => {
  const ObstetricUltrasoundRecord = sequelize.define('ObstetricUltrasoundRecord', {
    patient_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    number_of_fetus: { type: DataTypes.INTEGER },
    biparietal: { type: DataTypes.STRING },
    heart_rate: { type: DataTypes.STRING },
    presentation: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'obstetricultrasoundrecords',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return ObstetricUltrasoundRecord;
};
