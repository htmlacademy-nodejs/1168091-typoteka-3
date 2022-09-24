export class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return [...new Set(this._articles.flatMap((item) => item.categories))];
  }
}
