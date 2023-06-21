import jwt from 'jsonwebtoken';
import ENV from '../config.js';
export default async function Auth(req, res, next) {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(' ')[1];
        // Retrieve the user detail to the loggedin user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        // res.json(decodedToken);
        next();
        // console.log(decodedToken);
    } catch (error) {
        res.status(401).json({ error: 'Authentication Failed !' });
    }
}
