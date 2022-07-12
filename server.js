const express = require('express')
const { notes } = require('./db/db.json')
const fs = require('fs')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

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

function createNewNotes(body, notesArray) {
  const note = body
  notesArray.push(note)
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2),
  )
  return note
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

app.post('/api/notes', (req, res) => {
  req.body.id = notes.length.toString()
  const note = createNewNotes(req.body, notes)
  res.json(note)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`)
})
