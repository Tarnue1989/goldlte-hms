module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('Claim', {
    invoice_id: { type: DataTypes.UUID },
    claim_status: { type: DataTypes.STRING },
    amount_approved: { type: DataTypes.DECIMAL },
    date_filed: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'claims',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Claim;
};
