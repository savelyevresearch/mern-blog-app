import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';

const mongodbClusterUsername = process.env.MONGODB_CLUSTER_USERNAME;
const mongodbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD;

mongoose
    .connect(`mongodb+srv://${mongodbClusterUsername}:${mongodbClusterPassword}@mern-social-network-clu.dya7ilm.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB is OK'))
    .catch(() => console.error('DB connection error'));


// Express app initializing
const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getMe);

// Port listening for the request accepting
app.listen(4444, (err) => {
    if (err) {
        console.error(err);

        return; 
    }

    console.log('Server is OK');
});