const mongoose = require('node/mongoose');
const uri = process.env.connectionString
mongoose.Promise = global.Promise;
mongoose.connect(uri).then(() => {
    console.log(`Connected to the database!`);
}).catch((e) => {
    console.log('Error connecting to the database!');
    console.log(e);
});

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);

module.exports = { mongoose };