'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      // Define the association between Cart and ServiceCategoryItem
      Cart.belongsTo(models.Service_Category_Item, {
        foreignKey: 'service_category_item_id',
        as: 'item',
      });
    }
  }
  Cart.init({
    user_id: DataTypes.INTEGER,
    service_category_item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName:'cart',
    modelName: 'Cart',
  });
  return Cart;
};