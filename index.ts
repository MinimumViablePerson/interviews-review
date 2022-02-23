import express from 'express'
import Database from 'better-sqlite3'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
  verbose: console.log
})

const getAllApplicants = db.prepare(`
SELECT * FROM applicants;
`)

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = ?;
`)

const updateApplicant = db.prepare(`
UPDATE applicants SET name=?, email=? WHERE id=?;
`)

const deleteApplicant = db.prepare(`
DELETE FROM applicants WHERE id=?;
`)

const getInterviewsFromApplicant = db.prepare(`
SELECT interviews.*, interviewers.name as 'interviewerName', interviewers.email as 'interviewerEmail' FROM interviews
JOIN interviewers ON interviews.interviewerId = interviewers.id
WHERE interviews.applicantId = ?;
`)

const getAllInterviewers = db.prepare(`
SELECT * FROM interviewers;
`)

const getAllInterviews = db.prepare(`
SELECT * FROM interviews;
`)

const deleteInterview = db.prepare(`
DELETE FROM interviews WHERE id=?;
`)

const deleteAllInterviewsForApplicant = db.prepare(`
DELETE FROM interviews WHERE applicantId = ?;
`)

app.get('/applicants', (req, res) => {
  const applicants = getAllApplicants.all()

  for (const applicant of applicants) {
    const interviews = getInterviewsFromApplicant.all(applicant.id)
    applicant.interviews = interviews
  }

  res.send(applicants)
})

app.get('/applicants/:id', (req, res) => {
  const id = req.params.id

  const applicant = getApplicantById.get(id)

  if (applicant) {
    const interviews = getInterviewsFromApplicant.all(applicant.id)
    applicant.interviews = interviews
    res.send(applicant)
  } else {
    res.status(404).send({ error: 'Applicant not found.' })
  }
})

app.delete('/applicants/:id', (req, res) => {
  const id = req.params.id

  deleteAllInterviewsForApplicant.run(id)

  const info = deleteApplicant.run(id)

  if (info.changes > 0) {
    res.send({ message: 'Yay!' })
  } else {
    res.status(404).send({ error: 'Nope' })
  }
})

app.delete('/interviews/:id', (req, res) => {
  const id = req.params.id
  // delete the interview if it exists
  const info = deleteInterview.run(id)

  if (info.changes > 0) {
    res.send({ message: 'Yay!' })
  } else {
    res.status(404).send({ error: 'Nope' })
  }
})

app.get('/interviewers', (req, res) => {
  const interviewers = getAllInterviewers.all()
  res.send(interviewers)
})

app.get('/interviews', (req, res) => {
  const interviews = getAllInterviews.all()
  res.send(interviews)
})

app.patch('/applicants/:id', (req, res) => {
  // get id from params
  const id = req.params.id
  // get info sent by user from body
  const { name, email } = req.body

  // check if the applicant exists ???
  const applicant = getApplicantById.get(id)
  if (applicant) {
    // if the id exists:
    //    - update any information provided by the fetcher
    //        - an SQL query to update an applicant
    //        - change any info that was given, the rest should stay the same
    updateApplicant.run(name ?? applicant.name, email ?? applicant.email, id)
    // - send them the updated applicant
    const updatedApplicant = getApplicantById.get(id)
    res.send(updatedApplicant)
  } else {
    // if not:
    //    - send them a 404 with an error
    res.status(404).send({ error: 'Applicant not found.' })
  }
})

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`)
})
