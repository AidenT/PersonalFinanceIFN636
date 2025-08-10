const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// We'll mock the User model before requiring the controller
const mockUser = {
    findOne: sinon.stub(),
    create: sinon.stub(),
    findById: sinon.stub()
};

// Mock the User module
require.cache[require.resolve('../models/User')] = {
    exports: mockUser
};

// Now require the controller after mocking User
const { registerUser, loginUser, getProfile, updateUserProfile } = require('../controllers/authController');

describe('Auth Controller Tests', () => {
    let req;
    let res;
    let statusStub;
    let jsonStub;

    beforeEach(() => {
        // Create fresh request and response mocks for each test
        req = {
            body: {},
            user: { id: 'mockUserId123' }
        };

        jsonStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub });
        
        res = {
            status: statusStub,
            json: jsonStub
        };

        // Reset all User method stubs
        mockUser.findOne.reset();
        mockUser.create.reset();
        mockUser.findById.reset();

        // Set up environment variable
        process.env.JWT_SECRET = 'test-secret-key';
    });

    afterEach(() => {
        // Restore all stubs after each test
        sinon.restore();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            // Arrange
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            const mockUserData = {
                id: 'user123',
                name: 'John Doe',
                email: 'john@example.com'
            };

            mockUser.findOne.resolves(null); // No existing user
            mockUser.create.resolves(mockUserData);
            sinon.stub(jwt, 'sign').returns('mock-jwt-token');

            // Act
            await registerUser(req, res);

            // Assert
            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonStub.calledWith({
                id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                token: 'mock-jwt-token'
            })).to.be.true;
        });

        it('should return error if user already exists', async () => {
            // Arrange
            req.body = {
                name: 'John Doe',
                email: 'existing@example.com',
                password: 'password123'
            };

            const existingUser = { email: 'existing@example.com' };
            mockUser.findOne.resolves(existingUser);

            // Act
            await registerUser(req, res);

            // Assert
            expect(statusStub.calledWith(400)).to.be.true;
            expect(jsonStub.calledWith({ message: 'User already exists' })).to.be.true;
        });

        it('should handle database errors during registration', async () => {
            // Arrange
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            mockUser.findOne.resolves(null);
            mockUser.create.rejects(new Error('Database connection failed'));

            // Act
            await registerUser(req, res);

            // Assert
            expect(statusStub.calledWith(500)).to.be.true;
            expect(jsonStub.calledWith({ message: 'Database connection failed' })).to.be.true;
        });
    });

    describe('loginUser', () => {
        it('should login user with valid credentials', async () => {
            // Arrange
            req.body = {
                email: 'john@example.com',
                password: 'password123'
            };

            const mockUserData = {
                id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword'
            };

            mockUser.findOne.resolves(mockUserData);
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').returns('mock-jwt-token');

            // Act
            await loginUser(req, res);

            // Assert
            expect(jsonStub.calledWith({
                id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                token: 'mock-jwt-token'
            })).to.be.true;
        });

        it('should reject login with invalid password', async () => {
            // Arrange
            req.body = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            const mockUserData = {
                id: 'user123',
                email: 'john@example.com',
                password: 'hashedPassword'
            };

            mockUser.findOne.resolves(mockUserData);
            sinon.stub(bcrypt, 'compare').resolves(false);

            // Act
            await loginUser(req, res);

            // Assert
            expect(statusStub.calledWith(401)).to.be.true;
            expect(jsonStub.calledWith({ message: 'Invalid email or password' })).to.be.true;
        });

        it('should reject login with non-existent user', async () => {
            // Arrange
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            mockUser.findOne.resolves(null);

            // Act
            await loginUser(req, res);

            // Assert
            expect(statusStub.calledWith(401)).to.be.true;
            expect(jsonStub.calledWith({ message: 'Invalid email or password' })).to.be.true;
        });
    });

    describe('getProfile', () => {
        it('should return user profile successfully', async () => {
            // Arrange
            const mockUserData = {
                name: 'John Doe',
                email: 'john@example.com',
                university: 'Test University',
                address: '123 Test Street'
            };

            mockUser.findById.resolves(mockUserData);

            // Act
            await getProfile(req, res);

            // Assert
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonStub.calledWith({
                name: 'John Doe',
                email: 'john@example.com',
                university: 'Test University',
                address: '123 Test Street'
            })).to.be.true;
        });

        it('should return 404 if user not found', async () => {
            // Arrange
            mockUser.findById.resolves(null);

            // Act
            await getProfile(req, res);

            // Assert
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonStub.calledWith({ message: 'User not found' })).to.be.true;
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            // Arrange
            req.body = {
                name: 'John Updated',
                email: 'john.updated@example.com',
                university: 'Updated University',
                address: '456 Updated Street'
            };

            const mockUserData = {
                id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                university: 'Old University',
                address: '123 Old Street',
                save: sinon.stub().resolves({
                    id: 'user123',
                    name: 'John Updated',
                    email: 'john.updated@example.com',
                    university: 'Updated University',
                    address: '456 Updated Street'
                })
            };

            mockUser.findById.resolves(mockUserData);
            sinon.stub(jwt, 'sign').returns('mock-jwt-token');

            // Act
            await updateUserProfile(req, res);

            // Assert
            expect(mockUserData.name).to.equal('John Updated');
            expect(mockUserData.email).to.equal('john.updated@example.com');
            expect(mockUserData.university).to.equal('Updated University');
            expect(mockUserData.address).to.equal('456 Updated Street');
            expect(jsonStub.calledWithMatch({
                id: 'user123',
                name: 'John Updated',
                email: 'john.updated@example.com',
                university: 'Updated University',
                address: '456 Updated Street',
                token: 'mock-jwt-token'
            })).to.be.true;
        });

        it('should return 404 if user not found during update', async () => {
            // Arrange
            req.body = { name: 'Updated Name' };
            mockUser.findById.resolves(null);

            // Act
            await updateUserProfile(req, res);

            // Assert
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonStub.calledWith({ message: 'User not found' })).to.be.true;
        });
    });
});
