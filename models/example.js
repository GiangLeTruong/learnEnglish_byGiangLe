'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Example extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Example.belongsTo(models.Vocabulary, { foreignKey: 'vocabularyId' });
    }
  }
  Example.init({
    sentence: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Example',
  });
  return Example;
};