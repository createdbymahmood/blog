import express from 'express';
import path from 'path';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';

import auth from './routes/auth';
import userRoutes from './routes/user';

const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
};

const app = express();

app.use(cors(corsOption));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'session secret',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth);
app.use('/user', userRoutes);

app.use(express.static(path.join(__dirname, '../public')));

app.listen(3001);
