import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

db.exec(`
CREATE TABLE locations (
  id INTEGER,
  address TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)
