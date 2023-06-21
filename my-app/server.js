import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import connect from './database/connection.js';
import router from './router/route.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const PORT = 8080;

// HTTP get request
app.get('/', (req, res) => {
    res.status(200).json('Home GET Request');
});

// api routes
app.use('/api', router);

mongoose
    .connect('mongodb://127.0.0.1:27017/login_system', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to database');
        try {
            // Start Server
            app.listen(PORT, () => {
                console.log(`Server connected to http://localhost:${PORT}`);
            });
        } catch (error) {
            console.log('Cannot connect to the server');
        }
    })
    .catch((err) => console.log('Error connecting to database', err));

// Start server only when we have valid connection
// connect()
//     .then(() => {
//         try {
//             // Start Server
//             app.listen(PORT, () => {
//                 console.log(`Server connected to http://localhost:${PORT}`);
//             });
//         } catch (error) {
//             console.log('Cannot connect to the server');
//         }
//     })
//     .catch((error) => {
//         console.log('Invalid database connection !!!');
//     });
