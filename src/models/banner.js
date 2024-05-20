'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
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
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName:'banner',
    modelName: 'Banner',
  });
  return Banner;
};