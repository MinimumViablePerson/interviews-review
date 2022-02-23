import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

db.exec(`
ALTER TABLE applicants
RENAME COLUMN firstName TO name;
`)
