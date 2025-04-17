module.exports = (sequelize, DataTypes) => {
  const PatientMessage = sequelize.define('PatientMessage', {
    sender_id: { type: DataTypes.UUID },
    receiver_id: { type: DataTypes.UUID },
    message: { type: DataTypes.TEXT },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patientmessages',     // ✅ Matches your actual DB schema
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return PatientMessage;
};
