import {DataTypes, Model} from "sequelize";

class Article extends Model {}

export const article = (sequelize) => Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      announce: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullText: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      picture: DataTypes.STRING,
    }, {
      sequelize,
      modelName: `Article`,
      tableName: `articles`
    }
);
