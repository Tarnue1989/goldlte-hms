module.exports = (sequelize, DataTypes) => {
  const Admission = sequelize.define('Admission', {
    patient_id: { type: DataTypes.UUID },
    doctor_id: { type: DataTypes.UUID },
    room_number: { type: DataTypes.STRING },
    bed_number: { type: DataTypes.STRING },
    department_id: { type: DataTypes.UUID },
    reason: { type: DataTypes.TEXT },
    admit_date: { type: DataTypes.DATE },
    discharge_date: { type: DataTypes.DATE },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'admissions',
    timestamps: true,
    
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Admission;
};
