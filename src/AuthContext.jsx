import React, { createContext, useState, useContext } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext(null);

function _encrypt(plainText, password) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 10000 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv });
    return salt.toString() + iv.toString() + encrypted.toString();
}

function _decrypt(encryptedData, password) {
    try {
        const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
        const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
        const ciphertext = encryptedData.substring(64);
        const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 10000 });
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [sessionPassword, setSessionPassword] = useState(null);

    const login = (password) => setSessionPassword(password);
    const logout = () => {
        setSessionPassword(null);
        localStorage.removeItem('token');
    };

    const encryptNote = (plainText) => {
        if (!sessionPassword) throw new Error("Authentication error.");
        return _encrypt(plainText, sessionPassword);
    };

    const decryptNote = (encryptedData) => {
        if (!sessionPassword) throw new Error("Authentication error.");
        return _decrypt(encryptedData, sessionPassword);
    };

    const value = {
        isAuthenticated: !!sessionPassword,
        login,
        logout,
        encryptNote,
        decryptNote
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}