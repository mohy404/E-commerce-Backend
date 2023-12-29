const path = require('path')

const cors = require('cors')
const compression = require('compression')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config({path: 'config.env'})
const ApiError = require('./utils/apiError')
const globalError = require('./middleware/errorMiddleware')
const dbConnection = require('./config/database')

// Routes
const mountRoutes = require('./routes')

// Connect with DB
dbConnection()

// Express App
const app = express()

// Enable other domains to access your App
app.use(cors())
app.options('*', cors())

// compress all responses
app.use(compression())

// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`node: ${process.env.NODE_ENV}`)
}


// Mount Routes
mountRoutes(app)

app.all('*', (req, res, next) =>{
    next(new ApiError(`Not Found : ${req.originalUrl}`, 400))
})

// Global errors Handling Middleware For Express
app.use(globalError)

const {PORT} = process.env
const server = app.listen(PORT , () =>{
    console.log(`server is running on port ${PORT}`);
})


// Handle Rejection outside express like db..
process.on("unhandledRejection", (err)=>{
    console.log(`Unhandled Rejection Error : ${err.name} | ${err.message}`);
    server.close(()=>{
        console.error('Shuting Down.....')
        process.exit(1)
    })
})