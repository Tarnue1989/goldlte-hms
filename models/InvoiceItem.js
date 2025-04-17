module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define('InvoiceItem', {
    invoice_id: { type: DataTypes.UUID },
    service_item_id: { type: DataTypes.UUID },
    unit_price: { type: DataTypes.DECIMAL },
    quantity: { type: DataTypes.INTEGER },
    total: { type: DataTypes.DECIMAL },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE } 
  }, {
    tableName: 'invoiceitems',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return InvoiceItem;
};
