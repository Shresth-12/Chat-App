import { JWT_SECRET } from "./config.js"
import pkg from "jsonwebtoken";
const { verify } = pkg;
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message:"Bearer Token Not found"
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded =verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            message:"Not authenticated"
        });
    }
};
export {
    authMiddleware
}