import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateToken from './generateToken.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection failed: ", err));

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});
const User = mongoose.model('User', userSchema);

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    color: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Note = mongoose.model('Note', noteSchema);

async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ error: 'User already exists!' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ message: "User registered", token });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'User not found ' });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return res.status(400).json({ error: 'Invalid credentials' });
    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token });
});

app.post('/api/postnote', authenticate, async (req, res) => {
    const { title, content, color } = req.body;
    const note = new Note({ title, content, color, userId: req.user._id });
    await note.save();
    res.status(201).json(note);
});

app.get('/api/getnotes', authenticate, async (req, res) => {
    const notes = await Note.find({ userId: req.user._id });
    res.json(notes);
});

app.delete('/api/deletenotes/:id', authenticate, async (req, res) => {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Note deleted" });
});

app.put('/api/updatenote/:id', authenticate, async (req, res) => {
    try {
        const { title, content, color } = req.body;
        const noteId = req.params.id;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.user._id },
            { title, content, color },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found or user not authorized' });
        }
        
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});


app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
