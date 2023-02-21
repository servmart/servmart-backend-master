const dotenv = require('dotenv');// for environment variables
dotenv.config({path:'./config.env'});


process.on('uncaughtException', err =>{
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION. SERVER SHUTTING DOWN')
    process.exit(1)
})

//MONGO DB CONNECTION

const mongoose = require('mongoose');
const { stringify } = require('querystring');
const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD )
mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(() => console.log("Connected to Database"));


//MONGO DB CONNECTION ENDS

const app = require('./app');

//const port = process.env.PORT || 4400;
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
const server = app.listen(port, () =>{
    console.log(`Listening to server on port ${port}`)
})

process.on('unhandledRejection', err =>{
    console.log('UNHANDLED REJECTION. SERVER SHUTTING DOWN')
    console.log(err.name, err.message);
    server.close(() =>{
        process.exit(1)
    });
})

process.on('uncaughtException', err =>{
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION. SERVER SHUTTING DOWN')
    server.close(() =>{
        process.exit(1)
    });
})