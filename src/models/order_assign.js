'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Assign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_Assign.belongsTo(models.Order, { foreignKey: 'order_id' });
    }
  }
  Order_Assign.init({
    delivery_boy_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName:'order_assign',
    modelName:'Order_Assign',
  });
  return Order_Assign;
};