import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user
 export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user
        const savedUser = await user.save();

        // Respond with the new user's information (excluding password)
        res.status(201).json({ id: savedUser._id, name: savedUser.name, email: savedUser.email });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with the token and user details
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to log in', error });
    }
};

// Get details of a specific user (for admin or user profile)
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user', error });
    }
};

// Update a user's role or details (admin-only action)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, isAdmin },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

// Delete a user (admin-only action)
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};

