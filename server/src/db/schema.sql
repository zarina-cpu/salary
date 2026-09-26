-- SQL-схема базы данных Salary Tracker
-- Таблицы для хранения доходов и расходов

-- Таблица доходов
CREATE TABLE IF NOT EXISTS incomes (
  id          TEXT PRIMARY KEY,
  amount      REAL NOT NULL CHECK(amount > 0),
  date        TEXT NOT NULL,
  category    TEXT NOT NULL,
  comment     TEXT DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Таблица расходов
CREATE TABLE IF NOT EXISTS expenses (
  id            TEXT PRIMARY KEY,
  amount        REAL NOT NULL CHECK(amount > 0),
  date          TEXT NOT NULL,
  category      TEXT NOT NULL,
  comment       TEXT DEFAULT '',
  is_recurring  INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Индексы для ускорения фильтрации по дате и категории
CREATE INDEX IF NOT EXISTS idx_incomes_date ON incomes(date);
CREATE INDEX IF NOT EXISTS idx_incomes_category ON incomes(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);