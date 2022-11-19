import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to get all articles',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({ _id: postId }, { $inc: { viewsCount: 1 } }, { returnDocument: 'after' }, (err, doc) => {
            if (err) {
                console.error(error);

                res.status(500).json({
                    message: 'Failed to get an article',
                });
            }

            if (!doc) {
                res.status(404).json({ message: 'Failed to find an article' });

                return;
            }

            res.json(doc);
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to get an article',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({ _id: postId }, (err, doc) => {
            if (err) {
                console.error(error);

                res.status(500).json({
                    message: 'Failed to remove an article',
                });
            }

            if (!doc) {
                res.status(404).json({ message: 'Failed to find an article' });

                return;
            }

            res.json({ success: true });
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to remove an article',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update an article',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to create an article',
        });
    }
};