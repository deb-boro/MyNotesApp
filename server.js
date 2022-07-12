const express = require('express')
const { notes } = require('./db/db.json')
const app = express()

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray

  if (query.title) {
    filteredResults = filteredResults.filter(
      (note) => note.title === query.title,
    )
  }

  return filteredResults
}

app.get('/api/notes', (req, res) => {
  let results = notes
  if (req.query) {
    results = filterByQuery(req.query, results)
  }
  res.json(results)
})

app.listen(3001, () => {
  console.log('API server now on port 3001')
})
