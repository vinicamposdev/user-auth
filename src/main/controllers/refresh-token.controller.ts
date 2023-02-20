import { RefreshTokenModel, RefreshToken } from '../models/refresh-token';
import createError from 'http-errors';
import { Role } from '../models/role';

export const deleteToken = async (token: string, user: any) => {
  try {
    const existingToken: RefreshToken = await RefreshTokenModel.getByToken(token);
    if (!existingToken) {
      return true;
    }
    if (existingToken.userId !== user.id && user.role !== Role.Admin) {
      throw createError(403, `You are not authorized delete the token ${token}`);
    }
    await RefreshTokenModel.deleteToken(token);
    return existingToken;
  } catch (error) {
    throw error;
  }
};

export const getTokens = async (user: any, userId: any) => {
  if (user.id !== userId && user.role !== Role.Admin) {
    throw createError(403, 'You are not authorized to access');
  }
  console.log('tokens for user: ', userId);
  try {
    if (!userId) {
      throw createError(400, 'User Id is required to get tokens');
    }
    const tokens = await RefreshTokenModel.getByUser(userId);
    return tokens;
  } catch (error) {
    throw error;
  }
};
