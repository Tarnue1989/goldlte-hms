module.exports = (sequelize, DataTypes) => {
  const ServiceItem = sequelize.define('ServiceItem', {
    name: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    reference_id: { type: DataTypes.UUID },
    cost: { type: DataTypes.DECIMAL },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'serviceitems',      // ✅ Exact match with your DB plan
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return ServiceItem;
};
