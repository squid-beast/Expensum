-- =============================================================
-- V1 — Initial Schema
-- Expensum — Production-Grade Schema
-- =============================================================

-- ---------------------------------------------------------------
-- users
-- monthly_income: NOT NULL DEFAULT 0 (required field)
-- phone_number:   NOT NULL (required field)
-- ---------------------------------------------------------------
CREATE TABLE users (
    id             BIGSERIAL PRIMARY KEY,
    email          VARCHAR(255)   NOT NULL UNIQUE,
    password       VARCHAR(255)   NOT NULL,
    full_name      VARCHAR(255)   NOT NULL,
    monthly_income DECIMAL(10,2)  NOT NULL DEFAULT 0,
    savings_goal   DECIMAL(10,2),
    phone_number   VARCHAR(20)    NOT NULL,
    created_at     TIMESTAMP      NOT NULL,
    updated_at     TIMESTAMP      NOT NULL
);

-- ---------------------------------------------------------------
-- households
-- ---------------------------------------------------------------
CREATE TABLE households (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    created_by  BIGINT       NOT NULL REFERENCES users(id),
    invite_code VARCHAR(36)  NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);

-- ---------------------------------------------------------------
-- household_members
-- ---------------------------------------------------------------
CREATE TABLE household_members (
    id           BIGSERIAL   PRIMARY KEY,
    household_id BIGINT      NOT NULL REFERENCES households(id),
    user_id      BIGINT      NOT NULL REFERENCES users(id),
    role         VARCHAR(10) NOT NULL CHECK (role IN ('OWNER', 'MEMBER')),
    joined_at    TIMESTAMP   NOT NULL,
    UNIQUE (household_id, user_id)
);

-- ---------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------
CREATE TABLE categories (
    id         BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(255) NOT NULL UNIQUE,
    icon       VARCHAR(255),
    created_at TIMESTAMP    NOT NULL
);

-- ---------------------------------------------------------------
-- expenses
-- ---------------------------------------------------------------
CREATE TABLE expenses (
    id           BIGSERIAL     PRIMARY KEY,
    user_id      BIGINT        NOT NULL REFERENCES users(id),
    category_id  BIGINT        NOT NULL REFERENCES categories(id),
    household_id BIGINT        REFERENCES households(id),
    amount       DECIMAL(10,2) NOT NULL,
    description  VARCHAR(500),
    expense_date DATE          NOT NULL,
    is_shared    BOOLEAN       NOT NULL DEFAULT FALSE,
    is_recurring BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP     NOT NULL,
    updated_at   TIMESTAMP     NOT NULL
);

-- ---------------------------------------------------------------
-- category_budgets
-- ---------------------------------------------------------------
CREATE TABLE category_budgets (
    id             BIGSERIAL     PRIMARY KEY,
    user_id        BIGINT        NOT NULL REFERENCES users(id),
    category_id    BIGINT        NOT NULL REFERENCES categories(id),
    budget_amount  DECIMAL(10,2) NOT NULL,
    month          INTEGER       NOT NULL CHECK (month BETWEEN 1 AND 12),
    year           INTEGER       NOT NULL CHECK (year >= 2000),
    created_at     TIMESTAMP     NOT NULL,
    updated_at     TIMESTAMP     NOT NULL,
    UNIQUE (user_id, category_id, month, year)
);

-- ---------------------------------------------------------------
-- expense_comments
-- ---------------------------------------------------------------
CREATE TABLE expense_comments (
    id         BIGSERIAL    PRIMARY KEY,
    expense_id BIGINT       NOT NULL REFERENCES expenses(id),
    user_id    BIGINT       NOT NULL REFERENCES users(id),
    content    VARCHAR(500) NOT NULL,
    created_at TIMESTAMP    NOT NULL
);

-- ---------------------------------------------------------------
-- household_notes
-- ---------------------------------------------------------------
CREATE TABLE household_notes (
    id           BIGSERIAL    PRIMARY KEY,
    household_id BIGINT       NOT NULL REFERENCES households(id),
    user_id      BIGINT       NOT NULL REFERENCES users(id),
    content      VARCHAR(500) NOT NULL,
    created_at   TIMESTAMP    NOT NULL
);

-- ---------------------------------------------------------------
-- invitations
-- Business rule: valid only when status = 'PENDING' AND expires_at > NOW()
-- ---------------------------------------------------------------
CREATE TABLE invitations (
    id               BIGSERIAL    PRIMARY KEY,
    household_id     BIGINT       NOT NULL REFERENCES households(id),
    inviter_user_id  BIGINT       NOT NULL REFERENCES users(id),
    invitee_email    VARCHAR(255) NOT NULL,
    status           VARCHAR(10)  NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
    token            VARCHAR(36)  NOT NULL UNIQUE,
    created_at       TIMESTAMP    NOT NULL,
    expires_at       TIMESTAMP    NOT NULL
);
