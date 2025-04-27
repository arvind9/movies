const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const intializeDBAandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log('DB Error')
  }
}
intializeDBAandServer()

// API - 1
app.get('/movies/', async (request, response) => {
  const getAllMoviNames = 'SELECT movie_name as movieName FROM MOVIE;'
  const movieNames = await db.all(getAllMoviNames)
  response.send(movieNames)
})

// API - 2
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addNewMovieQuery = `INSERT INTO movie (director_id, movie_name, lead_actor) VALUES (${directorId},'${movieName}','${leadActor}');`
  const dbresponse = await db.run(addNewMovieQuery)
  response.send('Movie Successfully Added')
})

// API - 3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieRequestQuery = `SELECT movie_id as movieId, director_id as directorId, movie_name as movieName, lead_actor as leadActor FROM movie WHERE movie_id = ${movieId};`
  const dbresponse = await db.get(getMovieRequestQuery)
  response.send(dbresponse)
})

// API - 4
app.put('/movies/:movieId/', async (request, response) => {
  const upadteMovie = request.body
  const {directorId, movieName, leadActor} = upadteMovie
  const upadteMovieQuery = `UPDATE movie SET director_id=${directorId}, movie_name='${movieName}', lead_actor='${leadActor}'`
  const dbresponse = db.run(upadteMovieQuery)
  response.send('Movie Details Updated')
})

// API - 5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `DELETE FROM movie WHERE movie_id=${movieId};`
  const movie = db.run(deleteMovieQuery)
  response.send('Movie Removed')
})

// API - 6
app.get('/directors/', async (request, response) => {
  const getAllDirectorNames =
    'SELECT director_id as directorId, director_name as directorName FROM director;'
  const directorNames = await db.all(getAllDirectorNames)
  response.send(directorNames)
})

//API - 7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const listMovieByDirector = `SELECT movie_name as movieName FROM movie WHERE director_id='${directorId}'`
  const movieList = await db.all(listMovieByDirector)
  response.send(movieList)
})

module.exports = app
