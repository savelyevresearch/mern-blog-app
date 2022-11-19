import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { validationResult } from 'express-validator';

import { registerValidation, loginValidation } from './validations/auth.js';

import UserModel from './models/User.js';

import checkAuth from './utils/checkAuth.js';

const mongodbClusterUsername = process.env.MONGODB_CLUSTER_USERNAME;
const mongodbClusterPassword = process.env.MONGODB_CLUSTER_PASSWORD;

mongoose
    .connect(`mongodb+srv://${mongodbClusterUsername}:${mongodbClusterPassword}@mern-social-network-clu.dya7ilm.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB is OK'))
    .catch(() => console.error('DB connection error'));


// Express app initializing
const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());

            return;
        }

        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json({ message: 'Password or email is invalid...' });

            return;
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPassword) {
            res.status(400).json({ message: 'Password or email is invalid...' });

            return;
        }

        const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());

            return;
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            res.status(404).json({ message: 'Something went wrong...' });

            return;
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

// Port listening for the request accepting
app.listen(4444, (err) => {
    if (err) {
        console.error(err);

        return; 
    }

    console.log('Server is OK');
});