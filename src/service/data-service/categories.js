export class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {

    const categories = new Set();

    this._articles.forEach((article) => {
      article.categories.forEach((category) => {
        categories.add(category);
      });
    });

    return [...categories];
  }
}
