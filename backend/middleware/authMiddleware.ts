const jwt = require('jsonwebtoken');
import User from '../models/User';
import { UserData, AuthenticatedRequest, ExpressResponse, UserPayload } from '../types/authTypes';

// Express next function interface
interface NextFunction {
    (): void;
}

const protect = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from Bearer header
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
            
            // Get user from token and attach to request
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }
            
            req.user = user as UserData;
            
            next();
        } catch (error: any) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    } else {
        // Fixed: This should be an else block, not a separate if
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
};

// Export using both CommonJS and ES6 for compatibility
const authMiddleware = { protect };

// CommonJS export for Node.js
module.exports = authMiddleware;

// ES6 export for TypeScript/modern environments
export { protect };
export default authMiddleware;
