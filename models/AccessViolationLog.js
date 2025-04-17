module.exports = (sequelize, DataTypes) => {
  const AccessViolationLog = sequelize.define('AccessViolationLog', {
    user_id: { type: DataTypes.UUID },
    action: { type: DataTypes.STRING },
    reason: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'accessviolationlogs',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return AccessViolationLog;
};
