import {Sequelize} from "sequelize";
import Alias from "../models/alias.js";

export class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async findAll(withCount) {
    if (withCount) {
      const categories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(`COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticlesCategories,
          as: Alias.ARTICLES_CATEGORIES,
          attributes: []
        }]
      });

      return categories.map((item) => item.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }
}
