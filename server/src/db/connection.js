import { DatabaseSync } from 'node:sqlite';// Подключение к базе данных SQLite через встроенный модуль node:sqlite
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from '../config/index.js';

// Получаем текущую директорию (для ES-модулей)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к файлу schema.sql
const schemaPath = join(__dirname, 'schema.sql');

// Создаём папку data/ если её нет (для файла БД)
const dataDir = dirname(config.dbPath);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log(`[DB] Создана папка для базы данных: ${dataDir}`);
}

// Открываем (или создаём) базу данных
const db = new DatabaseSync(config.dbPath);

// Включаем WAL-режим для лучшей производительности при параллельном чтении
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Читаем и выполняем SQL-схему (создание таблиц и индексов)
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log(`[DB] База данных подключена: ${config.dbPath}`);
console.log('[DB] Таблицы incomes и expenses готовы к работе');

// Экспортируем экземпляр базы данных для использования в сервисах
export default db;