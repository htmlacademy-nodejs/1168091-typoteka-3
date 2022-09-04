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
    console.log(`create`, this._articles.length);
    return newArticle;
  }

  update(oldArticle, article) {
    const index = this._articles.findIndex((item) => item.id === oldArticle.id);
    const changedArticle = Object.assign(oldArticle, article);
    this._articles = [
      ...this._articles.slice(0, index),
      changedArticle,
      ...this._articles.slice(index + 1)
    ];
    return changedArticle;
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
