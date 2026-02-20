-- =============================================================
-- V3 — Essential Performance Indexes
--
-- OMITTED (covered by UNIQUE constraints in V1 — implicit B-tree):
--   users.email              → email UNIQUE
--   households.invite_code   → invite_code UNIQUE
--   household_members(household_id, user_id) → UNIQUE(household_id, user_id)
--   invitations.token        → token UNIQUE
--
-- OMITTED (over-indexing — query planner ignores low-cardinality):
--   expenses.is_shared       → boolean, 2 values, seq scan is faster
--   invitations.expires_at   → token lookup returns 1 row; expiry check is trivial after
-- =============================================================

-- ---------------------------------------------------------------
-- households
-- FK not auto-indexed. Used for: "all households I created"
-- ---------------------------------------------------------------
CREATE INDEX idx_households_created_by
    ON households(created_by);

-- ---------------------------------------------------------------
-- household_members
-- UNIQUE(household_id, user_id) covers household-first lookups.
-- This covers user-first: "all households this user belongs to"
-- Used on every app load and dashboard membership check.
-- ---------------------------------------------------------------
CREATE INDEX idx_household_members_user
    ON household_members(user_id);

-- ---------------------------------------------------------------
-- expenses (fastest-growing table)
-- Composite user+date: personal dashboard — WHERE user_id = ? AND expense_date BETWEEN ? AND ?
-- Composite household+date: household dashboard — WHERE household_id = ? AND expense_date BETWEEN ? AND ?
-- category: GROUP BY category_id for dashboard breakdown aggregations
-- ---------------------------------------------------------------
CREATE INDEX idx_expenses_user_date
    ON expenses(user_id, expense_date);

CREATE INDEX idx_expenses_household_date
    ON expenses(household_id, expense_date);

CREATE INDEX idx_expenses_category
    ON expenses(category_id);

-- ---------------------------------------------------------------
-- category_budgets
-- UNIQUE(user_id, category_id, month, year) exists but has category_id
-- second — inefficient for monthly fetch without a category filter.
-- This index covers: WHERE user_id = ? AND year = ? AND month = ?
-- ---------------------------------------------------------------
CREATE INDEX idx_category_budgets_user_month
    ON category_budgets(user_id, year, month);

-- ---------------------------------------------------------------
-- expense_comments
-- FK not auto-indexed. Used for: all comments on a given expense.
-- ---------------------------------------------------------------
CREATE INDEX idx_expense_comments_expense
    ON expense_comments(expense_id);

-- ---------------------------------------------------------------
-- household_notes
-- FK not auto-indexed. Used for: all notes in a household timeline.
-- ---------------------------------------------------------------
CREATE INDEX idx_household_notes_household
    ON household_notes(household_id);

-- ---------------------------------------------------------------
-- invitations
-- FK not auto-indexed. Used for: pending invitations per household.
-- Token and status are both checked — token via its UNIQUE index,
-- household_id here covers list queries.
-- ---------------------------------------------------------------
CREATE INDEX idx_invitations_household
    ON invitations(household_id);
