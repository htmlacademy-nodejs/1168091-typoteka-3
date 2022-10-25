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

-- Получить список из 5 свежих комментариев
SELECT comments.*,
  users.first_name,
  users.last_name
FROM comments
  JOIN users ON users.id = comments.user_id
  ORDER BY comments.created_at
  LIMIT 5

-- Получить список комментариев для определённой публикации
SELECT comments.*,
  users.first_name,
  users.last_name
FROM comments
  JOIN users ON users.id = comments.user_id
WHERE comments.article_id = 2
  ORDER BY comments.created_at

-- Обновить заголовок определённой публикации
UPDATE articles
SET title = 'Как я встретил новый год'
WHERE id = 1


