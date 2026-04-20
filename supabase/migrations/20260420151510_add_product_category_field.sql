/*
  # Add product category support

  1. Changes
    - Adds `category` and `subcategory` columns to `product_specs` for filtering
    - Creates a new `product_categories` table for the category tree structure

  2. Category tree:
    - Автохимия
    - Инструменты и техника
    - Товары для дома
    - Шины и диски → Шины, Диски, Камеры, Принадлежности
    - Масла и жидкости → Моторные масла, Трансмиссионные масла, Тормозные жидкости, Антифризы
    - Запчасти → Тормозная система, Подвеска, Двигатель, Фильтры, Электрика

  3. Security - No RLS needed (public read)
*/

CREATE TABLE IF NOT EXISTS product_categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_slug text,
  sort_order int DEFAULT 0
);

INSERT INTO product_categories (name, slug, parent_slug, sort_order) VALUES
  ('Запчасти',              'parts',             NULL,    1),
  ('Тормозная система',     'brakes',            'parts', 1),
  ('Подвеска',              'suspension',        'parts', 2),
  ('Двигатель',             'engine',            'parts', 3),
  ('Фильтры',               'filters',           'parts', 4),
  ('Электрика',             'electrics',         'parts', 5),
  ('Масла и жидкости',      'oils',              NULL,    2),
  ('Моторные масла',        'engine-oils',       'oils',  1),
  ('Трансмиссионные масла', 'trans-oils',        'oils',  2),
  ('Тормозные жидкости',    'brake-fluids',      'oils',  3),
  ('Антифризы',             'coolants',          'oils',  4),
  ('Шины и диски',          'tyres',             NULL,    3),
  ('Шины',                  'tyres-only',        'tyres', 1),
  ('Диски',                 'wheels',            'tyres', 2),
  ('Камеры',                'tubes',             'tyres', 3),
  ('Принадлежности',        'tyre-accessories',  'tyres', 4),
  ('Автохимия',             'chemicals',         NULL,    4),
  ('Инструменты и техника', 'tools',             NULL,    5),
  ('Товары для дома',       'home',              NULL,    6)
ON CONFLICT (slug) DO NOTHING;

-- Add category_slug to product_specs for easy filtering
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_specs' AND column_name = 'category_slug'
  ) THEN
    ALTER TABLE product_specs ADD COLUMN category_slug text;
  END IF;
END $$;

-- Update existing product specs with category slugs
UPDATE product_specs SET category_slug = 'brakes'     WHERE product_id = 1;
UPDATE product_specs SET category_slug = 'filters'    WHERE product_id = 2;
UPDATE product_specs SET category_slug = 'suspension' WHERE product_id = 3;
UPDATE product_specs SET category_slug = 'electrics'  WHERE product_id = 4;
UPDATE product_specs SET category_slug = 'filters'    WHERE product_id = 5;
