const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const MOVIEDEX = require('./movies-data-small.json')
require('dotenv').config()
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})


// const genreOptions = [...new Set(MOVIEDEX.map(movie => movie.genre.toLowerCase()))];
// const countryOptions = [...new Set(MOVIEDEX.map(movie => movie.country.toLowerCase())
//     .join(',')
//     .split(',')
//     .map(movie=>movie.trim()))];
// console.log('countryOptions', countryOptions)

function handleGetMovies(req, res) {
    let response = MOVIEDEX;

    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if (req.query.avg_vote) {
        response = response.filter(movie =>
            parseFloat(movie.avg_vote) >= parseFloat(req.query.avg_vote)
        )
    }

    res.json(response)
}

app.get('/movies', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})