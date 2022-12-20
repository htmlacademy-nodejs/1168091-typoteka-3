import Alias from "../models/alias.js";
import {Sequelize} from "sequelize";

export class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async create(article) {
    const newArticle = await this._Article.create(article);
    await newArticle.addCategories(article.categories);
    return newArticle.get();
  }

  async delete(id) {
    const deleteRows = await this._Article.destroy({
      where: {id}
    });

    return !!deleteRows;
  }

  async findOne(articleId) {

    const options = {
      include: [
        {
          model: this._Category,
          as: Alias.CATEGORIES,
          attributes: [
            `id`,
            `name`
          ],
          include: [{
            model: this._ArticlesCategories,
            as: Alias.ARTICLES_CATEGORIES,
            attributes: [
              [Sequelize.fn(`COUNT`, Sequelize.col(`CategoryId`)), `total`],
            ]
          }],
        },
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          include: [
            {
              model: this._User,
              as: Alias.USERS,
              attributes: {
                exclude: [`passwordHash`]
              }
            }
          ],
          attributes: {
            exclude: [`userId`]
          }
        },
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      where: [{
        id: articleId
      }],
      attributes: [`id`, `title`, `announce`, `fullText`, `picture`, `createdAt`]
    };

    return await this._Article.findOne(options);
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }

  async findAll(needComments = false) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }
}
