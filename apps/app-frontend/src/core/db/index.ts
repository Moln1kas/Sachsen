import Database from '@tauri-apps/plugin-sql';

const db = await Database.load('sqlite:app.db');

db.execute(`
CREATE TABLE IF NOT EXISTS auth (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL
);    
`);

export default db;