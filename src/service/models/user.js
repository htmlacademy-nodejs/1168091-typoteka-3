import {DataTypes, Model} from "sequelize";
import {UserRole} from "../../const.js";

class User extends Model {}

export const user = (sequelize) => User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM,
        values: [UserRole.AUTHOR, UserRole.READER]
      }
    }, {
      sequelize,
      modelName: `User`,
      tableName: `users`
    }
);
