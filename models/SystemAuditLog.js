module.exports = (sequelize, DataTypes) => {
  const SystemAuditLog = sequelize.define('SystemAuditLog', {
    table_name: { type: DataTypes.STRING },
    record_id: { type: DataTypes.UUID },
    action: { type: DataTypes.STRING },
    changes: { type: DataTypes.JSON },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID }
  }, {
    tableName: 'systemauditlogs',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return SystemAuditLog;
};
