module.exports = (sequelize, DataTypes) => {
  const LabResult = sequelize.define('LabResult', {
    lab_request_id: { type: DataTypes.UUID },
    result: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
    entered_by: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE } 
  }, {
    tableName: 'labresults',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return LabResult;
};
