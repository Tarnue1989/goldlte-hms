module.exports = (sequelize, DataTypes) => {
  const TriageRecord = sequelize.define('TriageRecord', {
    patient_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    triage_status: { type: DataTypes.STRING },
    symptoms: { type: DataTypes.TEXT },
    bp: { type: DataTypes.STRING },
    hr: { type: DataTypes.INTEGER },
    rr: { type: DataTypes.INTEGER },
    temp: { type: DataTypes.DECIMAL },
    o2: { type: DataTypes.INTEGER },
    wt: { type: DataTypes.DECIMAL },
    ht: { type: DataTypes.DECIMAL },
    rbg: { type: DataTypes.DECIMAL },
    triage_notes: { type: DataTypes.TEXT },
    registration_id: { type: DataTypes.UUID },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID }
  }, {
    tableName: 'triagerecords',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return TriageRecord;
};
