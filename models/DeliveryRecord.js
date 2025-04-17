module.exports = (sequelize, DataTypes) => {
  const DeliveryRecord = sequelize.define('DeliveryRecord', {
    patient_id: { type: DataTypes.UUID },
    midwife_id: { type: DataTypes.UUID },
    delivery_date: { type: DataTypes.DATE },
    delivery_type: { type: DataTypes.STRING },
    newborn_weight: { type: DataTypes.STRING },
    newborn_gender: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'deliveryrecords',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return DeliveryRecord;
};
