module.exports = (sequelize, DataTypes) => {
  const PharmacyTransaction = sequelize.define('PharmacyTransaction', {
    medication_id: { type: DataTypes.UUID },
    type: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER },
    source: { type: DataTypes.STRING },
    fulfilled_by: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'pharmacytransactions',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return PharmacyTransaction;
};
