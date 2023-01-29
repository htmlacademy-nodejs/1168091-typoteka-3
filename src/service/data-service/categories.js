import {Sequelize} from "sequelize";
import Alias from "../models/alias.js";

export class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Category.findAndCountAll({
      limit,
      offset,
      attributes: [`id`, `name`],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, categories: rows};
  }

  async findAll(withCount) {
    if (withCount === `true`) {
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

  async create(category) {
    const existedCategory = await this._Category.findOne({where: {name: category.name}});

    if (existedCategory === null) {
      const newCategory = await this._Category.create(category);
      return newCategory.get();
    } else {
      return null;
    }
  }

  async delete(id) {
    const articlesId = await this._ArticlesCategories.findAll({where: {
      CategoryId: id
    }});

    if (!articlesId.length) {
      const deleteRows = await this._Category.destroy({
        where: {id}
      });

      return !!deleteRows;
    } else {
      return false;
    }
  }

  async update(id, name) {
    const existedCategory = await this._Category.findOne({where: {name}});

    if (existedCategory === null) {
      const [affectedRows] = await this._Category.update({name}, {
        where: {id}
      });

      return !!affectedRows;
    } else {
      return null;
    }
  }
}
