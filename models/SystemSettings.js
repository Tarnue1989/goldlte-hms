module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SystemSettings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    logo_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    favicon_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    homepage_video_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    primary_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#007BFF'
    },
    footer_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hospital_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    operating_hours: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(5),
      defaultValue: 'en'
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'system_settings', // Matches your actual DB table name
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
};
