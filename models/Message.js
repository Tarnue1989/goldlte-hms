module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender_id: { type: DataTypes.UUID },
    receiver_id: { type: DataTypes.UUID },
    message: { type: DataTypes.TEXT },
    read: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'messages',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Message;
};
