/*
  # Store users and product specifications

  1. New Tables
    - `store_users` - Customer accounts for the storefront (separate from admin users)
      - `id` (uuid, primary key, linked to auth.users)
      - `username` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `created_at` (timestamptz)

    - `product_specs` - Extended technical specifications per product
      - `id` (uuid, primary key)
      - `product_id` (int) - references the .NET backend product ID
      - `spec_key` (text) - characteristic name
      - `spec_value` (text) - characteristic value
      - `sort_order` (int) - display order
      - `created_at` (timestamptz)

    - `product_images` - Product image URLs
      - `id` (uuid, primary key)
      - `product_id` (int)
      - `image_url` (text)
      - `is_primary` (boolean)

  2. Security
    - RLS enabled on all tables
    - store_users: users can read/update their own profile
    - product_specs: public read access (product specs are public)
    - product_images: public read access
*/

CREATE TABLE IF NOT EXISTS store_users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   text UNIQUE NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name  text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  phone      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON store_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON store_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON store_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS product_specs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  int NOT NULL,
  spec_key    text NOT NULL,
  spec_value  text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product specs"
  ON product_specs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage product specs"
  ON product_specs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS product_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id int NOT NULL,
  image_url  text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product images"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage product images"
  ON product_images FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_product_specs_product_id  ON product_specs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
