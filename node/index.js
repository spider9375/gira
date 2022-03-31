require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan')

const mongoose = require('./mongoose');
const authRoute = require('./routes/auth')
// const usersRoute = require('./routes/users')
// const tasksRoute = require('./routes/tasks')
// const projectsRoute = require('./routes/projects')
const sendErrorResponse = require('./utils').sendErrorResponse;

const corsOptions = {
    origin: 'http://localhost:4200', // frontend server
}
app.use(morgan("dev"))
app.use(cors(corsOptions))
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'))
// app.use('/api/users', usersRoute)
// app.use('/api/tasks',tasksRoute)
// app.use('/api/projects', projectsRoute)
app.use('/api', authRoute)


app.use(function (err, req, res, next) {
    console.error(err.stack)
    sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err);
})

app.listen(3002, () => {
    console.log('server started')
})