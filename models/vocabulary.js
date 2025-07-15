'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vocabulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vocabulary.hasMany(models.Example, { foreignKey: 'vocabularyId' });
      Vocabulary.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Vocabulary.hasOne(models.Media, { foreignKey: 'vocabularyId' });
      Vocabulary.belongsTo(models.Certificate, { foreignKey: 'certificateId' });
    }
  }
  Vocabulary.init({
    word: DataTypes.STRING,
    definition: DataTypes.TEXT,
    pronunciation: DataTypes.STRING,
    type: DataTypes.STRING,
    meaning_vi: DataTypes.TEXT,
    note: DataTypes.TEXT,
    difficulty: DataTypes.INTEGER,
    isLearned: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Vocabulary',
  });
  return Vocabulary;
};