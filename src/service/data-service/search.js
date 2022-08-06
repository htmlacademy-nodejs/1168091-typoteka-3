export class SearchService {
  constructor(articles) {
    this._articles = articles;
  }


  findAll(query) {
    return this._articles.filter((item) => item.title.includes(query));
  }
}
