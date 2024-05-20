'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
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
    is_active: DataTypes.STRING
  }, {
    sequelize,
    tableName:'user',
    modelName: 'User',
  });
  return User;
};