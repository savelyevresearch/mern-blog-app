import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation } from './validations/auth.js';
import { postValidation } from './validations/post.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import { create, getAll, getOne, remove, update } from './controllers/PostController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

const mongodbClusterUsername = process.env.MONGODB_CLUSTER_USERNAME;
const mongodbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD;
const mongodbClusterDomainName = process.env.MONGODB_CLUSTER_DOMAIN_NAME;

mongoose
    .connect(`mongodb+srv://${mongodbClusterUsername}:${mongodbClusterPassword}@${mongodbClusterDomainName}/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB is OK'))
    .catch(() => console.error('DB connection error'));


// Express app initializing
const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.post('/auth/register', registerValidation, handleValidationErrors, register);

app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    });
});

app.post('/posts', checkAuth, postValidation, handleValidationErrors, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postValidation, handleValidationErrors, update);
app.get('/posts', getAll);
app.get('/posts/:id', getOne);

// Port listening for the request accepting
app.listen(4444, (err) => {
    if (err) {
        console.error(err);

        return; 
    }

    console.log('Server is OK');
});