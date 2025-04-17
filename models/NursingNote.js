module.exports = (sequelize, DataTypes) => {
  const NursingNote = sequelize.define('NursingNote', {
    patient_id: { type: DataTypes.UUID },
    admission_id: { type: DataTypes.UUID },
    nurse_id: { type: DataTypes.UUID },
    note: { type: DataTypes.TEXT },
    timestamp: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'nursingnotes',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return NursingNote;
};
