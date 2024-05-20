'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_Item.belongsTo(models.Order, { foreignKey: 'order_id' });
      Order_Item.belongsTo(models.Service_Category_Item, { foreignKey: 'service_category_item_id' });
    }
  }
  Order_Item.init({
    order_id: DataTypes.INTEGER,
    service_category_item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'order_item',
    modelName: 'Order_Item',
  });
  return Order_Item;
};