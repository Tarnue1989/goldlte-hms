module.exports = (sequelize, DataTypes) => {
  const Medication = sequelize.define('Medication', {
    name: { type: DataTypes.STRING },
    generic_group: { type: DataTypes.STRING },
    dosage_form: { type: DataTypes.STRING },
    strength: { type: DataTypes.STRING },
    reorder_level: { type: DataTypes.INTEGER },
    stock_qty: { type: DataTypes.INTEGER },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID }
  }, {
    tableName: 'medications',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Medication;
};
