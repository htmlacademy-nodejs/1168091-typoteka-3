import {DataTypes, Model} from "sequelize";

class Category extends Model {}

export const category = (sequelize) => Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: `Category`,
      tableName: `categories`
    }
);
