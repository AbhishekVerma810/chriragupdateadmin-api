'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Delivery_Boy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Delivery_Boy.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    token: DataTypes.STRING,
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
    role_id: DataTypes.STRING,
    status: DataTypes.STRING,
    fcm_token: DataTypes.STRING,
    verification_status: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'delivery_boy',
    modelName: 'Delivery_Boy',
  });
  return Delivery_Boy;
};