import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = req.headers.authorization || '';

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');

            req.userId = decoded._id;

            next();
        } catch (error) {
            res.status(403).json({ message: 'Something went wrong...' });

            return;
        }
    } else {
        res.status(403).json({ message: 'Something went wrong...' });

        return;
    }
};