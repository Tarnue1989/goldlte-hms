module.exports = (sequelize, DataTypes) => {
  return sequelize.define('HomeVideo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    language: {
      type: DataTypes.STRING(5),
      defaultValue: 'en'
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID
    },
    updated_by: {
      type: DataTypes.UUID
    },
    deleted_by: {
      type: DataTypes.UUID
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    tableName: 'home_videos', // Matches actual DB table
    paranoid: true,
    deletedAt: 'deleted_at'
  });
};
