import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation } from './validations/auth.js';

import { postValidation } from './validations/post.js';

import { UserController, PostController } from './controllers/index.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

const mongodbClusterUsername = process.env.MONGODB_CLUSTER_USERNAME;
const mongodbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD;
const mongodbClusterDomainName = process.env.MONGODB_CLUSTER_DOMAIN_NAME;

mongoose
    .connect(`mongodb+srv://${mongodbClusterUsername}:${mongodbClusterPassword}@${mongodbClusterDomainName}/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB is OK'))
    .catch(() => console.error('DB connection error'));

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

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    });
});

app.post('/posts', checkAuth, postValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postValidation, handleValidationErrors, PostController.update);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.listen(4444, (err) => {
    if (err) {
        console.error(err);

        return; 
    }

    console.log('Server is OK');
});