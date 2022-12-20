import {Op} from 'sequelize';
import Alias from '../models/alias.js';

export class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }


  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Alias.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }
}
