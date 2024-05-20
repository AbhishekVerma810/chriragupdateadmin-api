'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Support_Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Support_Ticket.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    tableName:'support_ticket',
    modelName: 'Support_Ticket',
  });
  return Support_Ticket;
};