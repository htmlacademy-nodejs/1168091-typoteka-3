import {article} from "./article.js";
import {category} from "./category.js";
import {comment} from "./comment.js";
import {user} from "./user.js";
import {articlesCategories} from "./articles-categories.js";

import Alias from "./alias.js";

export default (sequelize) => {
  const Article = article(sequelize);
  const Category = category(sequelize);
  const Comment = comment(sequelize);
  const User = user(sequelize);
  const ArticlesCategories = articlesCategories(sequelize);

  // один юзер имеет много публикаций
  User.hasMany(Article, {
    as: Alias.ARTICLES,
    foreignKey: `userId`,
    onDelete: `cascade`
  });
  Article.belongsTo(User, {
    as: Alias.USERS,
    foreignKey: `userId`
  });

  // одна публикация имеет много комментов
  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(Article, {
    foreignKey: `articleId`
  });

  // один юзер имеет много комментов
  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(User, {
    as: Alias.USERS,
    foreignKey: `userId`
  });


  // у публикации много категорий и у категории много публикаций. связь через ArticlesCategories
  Article.belongsToMany(Category, {
    through: ArticlesCategories,
    as: Alias.CATEGORIES
  });
  Category.belongsToMany(Article, {
    through: ArticlesCategories,
    as: Alias.ARTICLES
  });
  Category.hasMany(ArticlesCategories, {
    as: Alias.ARTICLES_CATEGORIES
  });

  return {Article, Category, Comment, User, ArticlesCategories};
};
