import {DataTypes, Model} from "sequelize";

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
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM,
        values: [`guest`, `author`, `reader`]
      }
    }, {
      sequelize,
      modelName: `User`,
      tableName: `users`
    }
);
