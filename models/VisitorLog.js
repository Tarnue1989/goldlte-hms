module.exports = (sequelize, DataTypes) => {
  const VisitorLog = sequelize.define('VisitorLog', {
    patient_id: { type: DataTypes.UUID },
    visitor_name: { type: DataTypes.STRING },
    relation: { type: DataTypes.STRING },
    purpose: { type: DataTypes.STRING },
    check_in_time: { type: DataTypes.DATE },
    check_out_time: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'visitorlogs',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return VisitorLog;
};
