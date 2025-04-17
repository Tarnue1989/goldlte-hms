module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    full_name: { type: DataTypes.STRING },
    date_of_birth: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    email_address: { type: DataTypes.STRING },
    home_address: { type: DataTypes.STRING },
    marital_status: { type: DataTypes.STRING },
    religion: { type: DataTypes.STRING },
    profession: { type: DataTypes.STRING },
    emergency_contact_name: { type: DataTypes.STRING },
    emergency_contact_phone: { type: DataTypes.STRING },
    registration_status: { type: DataTypes.STRING },
    employee_id: { type: DataTypes.UUID },
    photo_path: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'patients',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Patient;
};
