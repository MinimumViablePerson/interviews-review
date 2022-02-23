-- SQLite
-- SQLite
-- SELECT DISTINCT interviewers.* FROM interviewers
-- JOIN interviews ON interviewers.id = interviews.interviewerId
-- WHERE interviews.applicantId = 3;

-- applicants - interviews - interviewers

-- SELECT applicants.*, interviews.date, interviews.score, interviewers.name as 'interviewerName' FROM applicants
-- JOIN interviews ON applicants.id = interviews.applicantId
-- JOIN interviewers ON interviewers.id = interviews.interviewerId
-- WHERE applicants.id = 3;

-- SELECT DISTINCT applicants.* FROM applicants
-- JOIN interviews ON applicants.id = interviews.applicantId
-- WHERE interviews.interviewerId = 3;
