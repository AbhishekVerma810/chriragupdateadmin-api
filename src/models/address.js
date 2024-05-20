'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.hasMany(models.Order, { foreignKey: 'address_id' });
    }
  }
  Address.init({
    user_id: DataTypes.INTEGER,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    house_no: DataTypes.STRING,
    country: DataTypes.STRING,
    address_line: DataTypes.STRING
  }, {
    sequelize,
    tableName:'address',
    modelName: 'Address',
  });
  return Address;
};