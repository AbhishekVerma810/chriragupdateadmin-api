'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service_Category.belongsTo(models.Service, {
        foreignKey: 'service_id'
      }); 
      Service_Category.hasMany(models.Service_Category_Item, {
        foreignKey: 'service_category_id',
        as: 'items'
      });
    }
  }
  Service_Category.init({
    service_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName:'service_category',
    modelName: 'Service_Category',
  });
  return Service_Category;
};