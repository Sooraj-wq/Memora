import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config;

function generateToken(id){
    return jwt.sign({id:id}, process.env.SECRET_KEY, {expiresIn:'1d'});
}

export default generateToken;