module.exports = (sequelize, DataTypes) => {
  const InsuranceProvider = sequelize.define('InsuranceProvider', {
    name: { type: DataTypes.STRING },
    contact_info: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'insuranceproviders',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return InsuranceProvider;
};
