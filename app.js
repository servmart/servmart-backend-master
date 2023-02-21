const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

const globalErrorHandler = require('./controllers/errorController');

const AppError = require('./utils/appError');

//middleware for post method to get data on req.body
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//custom middleware for future use
app.use((req, res, next) => {
    console.log("Hello from middleware!");
    next();
});

app.get('/', (req, res) =>{
    res.send("Hello from the server 123")

})

app.options('*', cors())

const productRouter = require('./routers/productRoutes');
const usersRouter = require('./routers/userRoutes');


// const productRouter = express.Router();
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', usersRouter);// mounting a new router

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!!!`));
});

app.use(cors());

app.use(globalErrorHandler);

module.exports = app;