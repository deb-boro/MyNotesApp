const express = require('express')
const { notes } = require('./db/db.json')
const app = express()

const PORT = process.env.PORT || 3001

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray

  if (query.title) {
    filteredResults = filteredResults.filter(
      (note) => note.title === query.title,
    )
  }

  return filteredResults
}

function findById(id, notesArray) {
  const result = notesArray.filter((notes) => notes.id === id)
  return result
}

app.get('/api/notes', (req, res) => {
  let results = notes
  if (req.query) {
    results = filterByQuery(req.query, results)
  }
  res.json(results)
})

app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes)

  if (result) {
    res.json(result)
  } else {
    res.send(404)
  }
})

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`)
})
