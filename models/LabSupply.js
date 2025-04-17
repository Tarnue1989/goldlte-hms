module.exports = (sequelize, DataTypes) => {
  const LabSupply = sequelize.define('LabSupply', {
    name: { type: DataTypes.STRING },
    unit: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER },
    reorder_level: { type: DataTypes.INTEGER },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'labsupplys', // Matches existing table in your DB
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return LabSupply;
};
