/*
  # Create support_requests table

  1. New Tables
    - `support_requests`
      - `id` (uuid, primary key)
      - `category` (text) - support category (order, product, delivery, other)
      - `subject` (text) - request subject
      - `message` (text) - full message body
      - `sender_email` (text) - customer email
      - `created_at` (timestamptz) - submission timestamp

  2. Security
    - Enable RLS on `support_requests` table
    - Service role can insert (edge function uses service key)
    - No public read access — admin only via service role
*/

CREATE TABLE IF NOT EXISTS support_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category     text NOT NULL DEFAULT 'other',
  subject      text NOT NULL,
  message      text NOT NULL,
  sender_email text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert support requests"
  ON support_requests
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can select support requests"
  ON support_requests
  FOR SELECT
  TO service_role
  USING (true);
