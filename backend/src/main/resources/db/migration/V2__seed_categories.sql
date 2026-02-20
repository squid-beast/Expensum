-- =============================================================
-- V2 — Seed Categories
-- Static dataset — application layer should cache this.
-- =============================================================

INSERT INTO categories (name, icon, created_at) VALUES
    ('Food & Delivery',   'utensils',         NOW()),
    ('Groceries',         'shopping-cart',    NOW()),
    ('Fun/Entertainment', 'smile',            NOW()),
    ('Rent',              'home',             NOW()),
    ('Utilities',         'zap',              NOW()),
    ('Subscriptions',     'repeat',           NOW()),
    ('Shopping',          'shopping-bag',     NOW()),
    ('Travel',            'plane',            NOW()),
    ('Other',             'more-horizontal',  NOW());
