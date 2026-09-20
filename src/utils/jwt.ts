import jwt from 'jsonwebtoken';
import {UserPayload} from '@/types/auth';

export const generateTokens = (user: UserPayload) => {
    const accessToken = jwt.sign(
        {uid: user.uid, role: user.role},
        process.env.JWT_ACCESS_SECRET!,
        {expiresIn: '15m'}
    );

    const refreshToken = jwt.sign(
        {uid: user.uid, role: user.role},
        process.env.JWT_REFRESH_SECRET!,
        {expiresIn: '7d'}
    );

    return {accessToken, refreshToken};
};

export const verifyAccessToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as UserPayload;
    } catch {
        return null;
    }
};

export const verifyRefreshToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as UserPayload;
    } catch {
        return null;
    }
};
