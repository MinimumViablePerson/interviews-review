import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

const applicants = [
  {
    name: 'Nicolas',
    email: 'ni@co.las'
  },
  {
    name: 'Ed',
    email: 'e@d.?'
  },
  {
    name: 'Rinor',
    email: 'ri@no.r'
  }
]

const interviewers = [
  {
    name: 'Artiola',
    email: 'ar@tio.la'
  },
  {
    name: 'Desintila',
    email: 'de@si.ntila'
  },
  {
    name: 'Jurgen',
    email: 'ju@rg.en'
  }
]

const interviews = [
  {
    date: '12/01/2022',
    score: 5,
    applicantId: 1,
    interviewerId: 1
  },
  {
    date: '15/01/2022',
    score: 10,
    applicantId: 1,
    interviewerId: 2
  },
  {
    date: '10/01/2022',
    score: 1,
    applicantId: 2,
    interviewerId: 3
  },
  {
    date: '20/01/2022',
    score: 9,
    applicantId: 2,
    interviewerId: 2
  },
  {
    date: '20/02/2022',
    score: 10,
    applicantId: 3,
    interviewerId: 1
  }
]

db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applicants;
DROP TABLE IF EXISTS interviewers;

CREATE TABLE IF NOT EXISTS applicants (
  id  INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviewers (
  id  INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  date TEXT NOT NULL,
  score INTEGER NOT NULL,
  applicantId INTEGER NOT NULL,
  interviewerId INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (applicantId) REFERENCES applicants(id),
  FOREIGN KEY (interviewerId) REFERENCES interviewers(id)
);
`)

const createApplicant = db.prepare(
  `INSERT INTO applicants (name, email) VALUES (?, ?);`
)

const createInterviewer = db.prepare(
  `INSERT INTO interviewers (name, email) VALUES (?, ?);`
)

const createInterview = db.prepare(
  `INSERT INTO interviews (date, score, applicantId, interviewerId) VALUES (?, ?, ?, ?);`
)

for (const applicant of applicants) {
  createApplicant.run(applicant.name, applicant.email)
}

for (const interviewer of interviewers) {
  createInterviewer.run(interviewer.name, interviewer.email)
}

for (const interview of interviews) {
  createInterview.run(
    interview.date,
    interview.score,
    interview.applicantId,
    interview.interviewerId
  )
}
