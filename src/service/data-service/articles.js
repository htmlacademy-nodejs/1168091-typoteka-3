import {nanoid} from "nanoid";
import {MAX_ID_LENGTH} from "../const.js";

export class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  create(article) {
    const newArticle = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      createdDate: new Date().toISOString(),
      comments: []
    }, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

  delete(id) {
    this._articles = this._articles.filter((item) => id !== item.id);
  }

  findComments(id) {
    const article = this._articles.find((item) => item.id === id);
    return article
      ? article.comments
      : [];
  }

  deleteComment(articleId, commentId) {
    const article = this._articles.find((item) => item.id === articleId);

    if (!article) {
      return false;
    }

    const {comments} = article;

    return comments.filter((item) => commentId !== item.id);
  }

  createComment(article, text) {
    const {comments} = article;

    comments.push({
      id: nanoid(MAX_ID_LENGTH),
      text
    });

    return comments;
  }
}
