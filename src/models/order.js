"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Address, { foreignKey: "address_id" });
      Order.hasMany(models.Order_Item, { foreignKey: "order_id" });
      // Define the association between Order and Order_Assign
     Order.hasOne(models.Order_Assign, { foreignKey: 'order_id' });

    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      address_id: DataTypes.INTEGER,
      order_date: DataTypes.STRING,
      total_amount: DataTypes.STRING,
      pickup_address: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "order",
      modelName: "Order",
    }
  );
  return Order;
};
