module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    patient_id: { type: DataTypes.UUID },
    total: { type: DataTypes.DECIMAL },
    status: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }  // ✅ required for soft delete
  }, {
    tableName: 'invoices',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Invoice;
};
