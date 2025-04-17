module.exports = (sequelize, DataTypes) => {
  const MaternityVisit = sequelize.define('MaternityVisit', {
    patient_id: { type: DataTypes.UUID },
    midwife_id: { type: DataTypes.UUID },
    visit_date: { type: DataTypes.DATE },
    fundus_height: { type: DataTypes.STRING },
    fetal_heart_rate: { type: DataTypes.STRING },
    presentation: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'maternityvisits',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return MaternityVisit;
};
