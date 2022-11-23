import {DataTypes, Model} from "sequelize";

class Comment extends Model {}

export const comment = (sequelize) => Comment.init(
    {
      fullText: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: `Comment`,
      tableName: `comments`
    }
);
