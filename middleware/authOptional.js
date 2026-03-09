import jwt from "jsonwebtoken";

const authOptional = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (err) {
        // If token is invalid, we still proceed but without a user ID
        next();
    }
};

export default authOptional;
