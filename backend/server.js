import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateToken from './generateToken.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { encrypt, decrypt } from './crypto.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err)=>console.log("MongoDB connection failed: ",err));

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

const User = mongoose.model('User',userSchema);

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  color: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Note = mongoose.model('Note', noteSchema);

async function authenticate(req,res,next){
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({error: 'No token provided'});

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        //The req.user field actually doesnt exist when the user gives the request, we are manually populating it after verification to be used for next() functions
        req.user = await User.findById(decoded.id).select('-password'); //Decoded id is from the payload -> jwt.sign({id:id},SECRET_KEY,{ expiresIn:'1d'}); note: passowrd is excluded
        next(); 
    }catch(err){
        res.status(401).json({error: 'Authentication failed'});
    }
};

app.post('/api/signup', async (req, res)=>{

    const {email, password} = req.body;
    const exists = await User.findOne({email});
    if(exists){
        return res.status(400).json({error: 'User already exists!'});
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({message:"User registered",token});

});

app.post('/api/login', async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user){
        return res.status(400).json({error: 'User not found '});
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token});
})

app.post('/api/postnote', authenticate, async (req, res) => {
  console.log("3. Data received on Backend:", req.body);
  const { title, content, color } = req.body;

  const encryptedContent = encrypt(content);
  const note = new Note({ title, content: encryptedContent, color, userId: req.user._id });
  await note.save();
  console.log({ ...note.toObject(), content });
  res.status(201).json({ ...note.toObject(), content });
});

app.get('/api/getnotes', authenticate, async (req, res) => {
  const notes = await Note.find({ userId: req.user._id });
  const decryptedNotes = notes.map(note => {
    try {
      const decryptedContent = decrypt(note.content);
      return { ...note.toObject(), content: decryptedContent };
    } catch (err) {
      return { ...note.toObject(), content: "Could not decrypt note." };
    }
  });

  res.json(decryptedNotes);
});

app.delete('/api/deletenotes/:id', authenticate, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Note deleted" });
});


app.listen(process.env.PORT, ()=> console.log(`Server running on ${process.env.PORT}`));