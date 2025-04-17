module.exports = (sequelize, DataTypes) => {
  const Bed = sequelize.define('Bed', {
    room_number: { type: DataTypes.STRING },
    bed_number: { type: DataTypes.STRING },
    department_id: { type: DataTypes.UUID },
    status: { type: DataTypes.ENUM('Available', 'Occupied', 'Reserved', 'Maintenance'), defaultValue: 'Available' },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    deleted_by: { type: DataTypes.UUID },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'beds',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return Bed;
};
