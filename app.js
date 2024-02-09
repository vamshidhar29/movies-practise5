const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'moviesData.db')

const api = express()
module.exports = api
api.listen(3000)
api.use(express.json())

let db = null

// Initialize Database Console
let initializeDbConsole = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
  } catch (e) {
    console.log(`Database Error: ${e}`)
    prosess.exit(1)
  }
}

initializeDbConsole()

//API 1
api.get('/movies/', async (request, response) => {
  const query = `
    select movie_name from movie;
    `

  const getMovieNames = await db.all(query)
  const convertToCamelCase = movie => {
    return {
      movieName: `${movie.movie_name}`,
    }
  }
  response.send(getMovieNames.map(movie => convertToCamelCase(movie)))
})

//API 2
api.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const query = `
    insert into movie
    (director_id, movie_name, lead_actor)
    values 
    (${movieDetails.directorId}, "${movieDetails.movieName}", "${movieDetails.leadActor}");
    `

  await db.run(query)
  response.send('Movie Successfully Added')
})

//API 3
api.get('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params

  const query = `
    select * from movie 
    where movie_id = ${movieId};
    `

  const getMovie = await db.get(query)
  response.send(getMovie)
})

//API 4
api.put('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body

  const query = `
    update movie
    set
    director_id = ${movieDetails.directorId},
    movie_name = "${movieDetails.movieName}",
    lead_actor = "${movieDetails.leadActor}"
    where movie_id = ${movieId};
    `

  const putMovie = await db.run(query)
  response.send('Movie Details Updated')
})

//API 5
api.delete('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params

  const query = `
    delete from movie
    where movie_id = ${movieId};
    `

  await db.run(query)
  response.send('Movie Removed')
})

//API 6
api.get('/directors', async (request, response) => {
  const query = `
    select * from director;
    `

  const convert = item => {
    return {
      directorId: `${item.director_id}`,
      directorName: `${item.director_name}`,
    }
  }

  const getDirector = await db.all(query)
  response.send(getDirector.map(item => convert(item)))
})

//API 7
api.get('/directors/:directorId/movies', async (request, response) => {
  const {directorId} = request.params

  const query = `
    select movie_name from movie
    where director_id = ${directorId};
    `

  const getMovieNameOfDirector = await db.all(query)
  const convert = item => {
    return {
      movieName: `${item.movie_name}`,
    }
  }
  response.send(getMovieNameOfDirector.map(item => convert(item)))
})
