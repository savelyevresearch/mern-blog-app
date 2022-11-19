import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
};

export const getMe = async (req, res) => {
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
};