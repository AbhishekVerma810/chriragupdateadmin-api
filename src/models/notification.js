'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    img_url: DataTypes.STRING,
    json_data: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    is_read: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName:'notification',
    modelName: 'Notification',
  });
  return Notification;
};