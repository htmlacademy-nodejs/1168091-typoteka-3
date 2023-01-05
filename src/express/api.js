import axios from "axios";

const Path = {
  ARTICLES: `/articles`,
  CATEGORIES: `/categories`,
  SEARCH: `/search`,
};

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const baseUrl = `${process.env.BASE_URL || `http://localhost`}:${port}/api/`;
const getDefaultAPI = () => new API(baseUrl, TIMEOUT);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles({comments, categoryId}) {
  // async getArticles({comments = false, categoryId}) {  TODO: по чему не работает параметр по умолчанию?
    return await this._load(Path.ARTICLES, {params: {comments, categoryId}});
  }

  async getOneArticle(articleId) {
    return await this._load(`${Path.ARTICLES}/${articleId}`);
  }

  async getComments(articleId) {
    return await this._load(`${Path.ARTICLES}/${articleId}/comments`);
  }

  async createArticle(data) {
    const res = await this._load(`${Path.ARTICLES}`, {
      method: `POST`,
      data,
    });
    return res;
  }

  async createComment(articleId, data) {
    return await this._load(`${Path.ARTICLES}/${articleId}/comments`, {
      method: `POST`,
      data,
    });
  }

  async deleteArticle(articleId) {
    return await this._load(`${Path.ARTICLES}/${articleId}`, {
      method: `DELETE`,
    });
  }

  async deleteComment(articleId, commentId) {
    return await this._load(`${Path.ARTICLES}/${articleId}/comments/${commentId}`, {
      method: `DELETE`,
    }
    );
  }

  async updateArticle(articleId, data) {
    return await this._load(`${Path.ARTICLES}/${articleId}`, {
      method: `PUT`,
      data,
    });
  }

  async getCategories({withCount}) {
    return await this._load(Path.CATEGORIES, {params: {withCount}});
  }

  async search(query) {
    return await this._load(Path.SEARCH, {params: {query}});
  }
}

export {
  API,
  getDefaultAPI
};
