module.exports = (sequelize, DataTypes) => {
  const Discharge = sequelize.define('Discharge', {
    admission_id: { type: DataTypes.UUID },
    discharge_summary: { type: DataTypes.TEXT },
    discharged_by: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'discharges',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Discharge;
};
