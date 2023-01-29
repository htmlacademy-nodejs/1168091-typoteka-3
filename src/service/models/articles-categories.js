import {Model} from "sequelize";

class ArticlesCategories extends Model {}

export const articlesCategories = (sequelize) => ArticlesCategories.init({}, {
  sequelize,
  modelName: `ArticlesCategories`,
  tableName: `articlesCategories`
});
