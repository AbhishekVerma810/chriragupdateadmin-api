'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service_Category_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    
      Service_Category_Item.belongsTo(models.Service_Category, {
        foreignKey: 'service_category_id',
        as: 'category',
      });
      Service_Category_Item.hasMany(models.Order_Item, { foreignKey: 'service_category_item_id' });
    }
  }
  Service_Category_Item.init({
    service_category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    img_url:  {
      type: DataTypes.STRING,
      get() {
        const img_url = this.getDataValue("img_url");
        if (img_url) {
          return process.env.BACKEND_URL + "upload/" + img_url;
        } else {
          return null;
        }
      },
    },
    price: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'service_category_item',
    modelName: 'Service_Category_Item',
  });
  return Service_Category_Item;
};