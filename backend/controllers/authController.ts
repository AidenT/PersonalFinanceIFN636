import User, { IUser, IUserCreate, IUserSafe } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Define types for our data structures - using the IUser interface
interface UserData {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    password?: string;
    university?: string;
    address?: string;
    save?: () => Promise<UserData>;
}

interface UserResponseData {
    id: string;
    name: string;
    email: string;
    token: string;
    university?: string;
    address?: string;
}

interface ProfileResponseData {
    name: string;
    email: string;
    university?: string;
    address?: string;
}

interface LoginRequestData {
    email: string;
    password: string;
}

interface RegisterRequestData {
    name: string;
    email: string;
    password: string;
}

interface UpdateProfileRequestData {
    name?: string;
    email?: string;
    university?: string;
    address?: string;
}

// Express request/response types (simplified)
interface ExpressRequest {
    body: any;
    user?: {
        id: string;
    };
}

interface ExpressResponse {
    status: (code: number) => ExpressResponse;
    json: (data: any) => void;
}

const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

const registerUser = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const { name, email, password }: RegisterRequestData = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user: IUser = await User.create({ name, email, password });
        const response: UserResponseData = {
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            token: generateToken(user._id.toString()) 
        };
        res.status(201).json(response);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const { email, password }: LoginRequestData = req.body;
    try {
        const user: IUser | null = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password as string))) {
            const response: UserResponseData = {
                id: user._id.toString(), 
                name: user.name, 
                email: user.email, 
                token: generateToken(user._id.toString()) 
            };
            res.json(response);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    try {
        const user: IUser | null = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const response: ProfileResponseData = {
            name: user.name,
            email: user.email,
            university: user.university,
            address: user.address,
        };
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    try {
        const user: IUser | null = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { name, email, university, address }: UpdateProfileRequestData = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;

        const updatedUser: IUser = await user.save();
        const response: UserResponseData = {
            id: updatedUser._id.toString(), 
            name: updatedUser.name, 
            email: updatedUser.email, 
            university: updatedUser.university, 
            address: updatedUser.address, 
            token: generateToken(updatedUser._id.toString()) 
        };
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// CommonJS export for Node.js (with destructuring support)
module.exports = { registerUser, loginUser, updateUserProfile, getProfile };

// ES6 export for TypeScript/modern environments
export { registerUser, loginUser, updateUserProfile, getProfile };
export default { registerUser, loginUser, updateUserProfile, getProfile };
