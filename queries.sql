-- список всех категорий
SELECT * FROM categories

-- список категорий где есть минимум одна публикация
SELECT id, name FROM categories
  JOIN articles_categories
  ON id = categories_id
  GROUP BY id

--  список категорий с количеством публикаций
