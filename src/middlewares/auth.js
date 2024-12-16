import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid Token');
        }
        if (!decoded.isAdmin) {
            return res.status(403).send('Access denied, admin only');
        }
        req.user = decoded;
        next();
    });
};
