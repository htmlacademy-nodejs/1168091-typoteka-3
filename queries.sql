-- список всех категорий
SELECT * FROM categories

-- список категорий где есть минимум одна публикация
SELECT id, name FROM categories
  JOIN articles_categories
  ON id = categories_id
  GROUP BY id

--  список категорий вместе с количеством публикаций
SELECT id, name, count(articles_id) FROM categories
  LEFT JOIN articles_categories
  ON id = categories_id
  GROUP BY id

--  список статей сначала свежие

SELECT articles.*,
  count(comments.id) as comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') as categories_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.articles_id
  JOIN categories ON articles_categories.categories_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC

-- полная информацию определённой публикации
-- (идентификатор публикации, заголовок публикации,
--  анонс, полный текст публикации, дата публикации,
--  путь к изображению, имя и фамилия автора,
--  контактный email, количество комментариев,
--  наименование категорий);

SELECT articles.*,
  count(comments.id) as comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') as categories_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.articles_id
  JOIN categories ON articles_categories.categories_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 2
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC


