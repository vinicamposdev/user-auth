import {addMinutes} from 'date-fns';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import {comparePasswords, hashPassword} from '../helpers/hash.helper';
import {ClientInfo} from '../models/refresh-token';
import type {User} from '../models/user';
import {UserModel} from '../models/user';

const createToken = (user: object) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN
  });
};

const decrypt = async <T>(ciphertext: string): Promise<T> => {
  return jwt.verify(ciphertext, process.env.JWT_SECRET) as any
}

type LoginToken = {
  email: string,
  password: string,
  iat: number,
  exp: number,
}

export interface CreatedUser {
  name: string;
  id: string;
  email: string;
}

export const login = async (
  email: string,
  password: string,
  clientInfo: ClientInfo
) => {
 // TODO: Your solution here
  const user = await UserModel.getByEmail(email);
  if (user) {
    const isValid = comparePasswords(password, user.password)
    if (isValid) {
      const accessToken = createToken({email, password, clientInfo})
      return {
        accessToken,
        name: user.name
      }
    }
  }
  return null
};

export const refreshToken = async (refreshToken: string) => {
  const refreshed = await decrypt<LoginToken>(refreshToken);
  const user = await UserModel.getByEmail(refreshed.email);
  if (user) {
    const token = createToken({email: user.email, password: user.password})
    return {
      userId: user._id,
      token
    }
  }
 return {}
};

export const register = async (newUser: User): Promise<CreatedUser> => {
  try {
    const existingUser = await UserModel.getByEmail(newUser.email, false);
    if (existingUser) {
      throw new Error ('exists');
    }
    newUser.password = hashPassword(newUser.password);
    return UserModel.add(newUser);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const existingUser = await UserModel.getByEmail(email);
    if (!existingUser) {
      throw createError(403, 'There was a problem. User does not exist');
    }
    const now = new Date();
    const passwordResetTokenExpires = addMinutes(now, 10);
    const passwordResetToken = uuid.v4();
    await existingUser.updateOne({
      passwordResetTokenExpires,
      passwordResetToken,
      updatedAt: now,
    });
    console.log('reset token:', passwordResetToken);
    console.log('reset token:', email);

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string, password: string, token: string) => {
  try {
    const user = await UserModel.getByEmail(email, false);
    if (!user) {
      throw createError(403, 'There was a problem reseting your password. User does not exist');
    }
    if (user.passwordResetToken !== token) {
      throw createError(403, 'There was a problem reseting your password. Invalid Token');
    }
    if (user.passwordResetTokenExpires < new Date()) {
      throw createError(403, 'There was a problem reseting your password. Token expired');
    }
    const hashedPassword = hashPassword(password);
    await user.updateOne({ password: hashedPassword });
    return { success: true };
  } catch (error) {
    throw error;
  }
};
