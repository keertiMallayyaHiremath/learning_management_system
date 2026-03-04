"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const security_1 = require("../config/security");
const db_1 = require("../config/db");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        const decoded = (0, security_1.verifyAccessToken)(token);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true }
        });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
