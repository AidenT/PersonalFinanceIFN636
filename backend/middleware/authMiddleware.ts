const jwt = require('jsonwebtoken');

// Define interfaces for our middleware
interface UserPayload {
    id: string;
    iat?: number;
    exp?: number;
}

interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    university?: string;
    address?: string;
    // password is excluded by select('-password')
}

// Extend Express Request interface to include user property
interface AuthenticatedRequest {
    headers: {
        authorization?: string;
        [key: string]: any;
    };
    user?: AuthenticatedUser;
    [key: string]: any;
}

// Express response interface (simplified)
interface ExpressResponse {
    status: (code: number) => ExpressResponse;
    json: (data: any) => void;
}

// Express next function interface
interface NextFunction {
    (): void;
}

// Import User model
const User = require('../models/User');

const protect = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from Bearer header
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
            
            // Get user from token and attach to request
            req.user = await User.findById(decoded.id).select('-password') as AuthenticatedUser;
            
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
