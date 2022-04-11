require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan')

const mongoose = require('./mongoose');
const authController = require('./controllers/auth-controller')
const userController = require('./controllers/user-controller')
const projectController = require('./controllers/project-controller')
const sendErrorResponse = require('./utils').sendErrorResponse;

const corsOptions = {
    origin: 'http://localhost:4200', // frontend server
}
app.use(morgan("dev"))
app.use(cors(corsOptions))
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'))
app.use('/api/users', userController)
app.use('/api/projects', projectController)
app.use('/api', authController)


app.use(function (err, req, res, next) {
    console.error(err.stack)
    sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err);
})

app.listen(3002, () => {
    console.log('server started')
})