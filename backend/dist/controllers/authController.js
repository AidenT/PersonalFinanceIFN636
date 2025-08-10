"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.updateUserProfile = exports.loginUser = exports.registerUser = void 0;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await User.create({ name, email, password });
        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        };
        res.status(201).json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const response = {
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            };
            res.json(response);
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const response = {
            name: user.name,
            email: user.email,
            university: user.university,
            address: user.address,
        };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getProfile = getProfile;
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { name, email, university, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;
        const updatedUser = await user.save();
        const response = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            university: updatedUser.university,
            address: updatedUser.address,
            token: generateToken(updatedUser.id)
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateUserProfile = updateUserProfile;
// CommonJS export for Node.js (with destructuring support)
module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
exports.default = { registerUser, loginUser, updateUserProfile, getProfile };
//# sourceMappingURL=authController.js.map