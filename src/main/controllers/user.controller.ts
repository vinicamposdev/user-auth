import { UserModel, User } from '../models/user';
import createError from 'http-errors';
import { hashPassword } from '../helpers/hash.helper';
import { Role } from '../models/role';
import { IPatch } from '../models/ipatch';

const changePassword = (attr: IPatch) => {
  if (attr.path === '/password') {
    return true;
  }
  return false;
};

export const addUser = async (newUser: any, user: any) => {
  if (!user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  try {
    const existingUser = await UserModel.getByEmail(newUser.email, false);
    if (existingUser) {
      return {
        exists: true,
      };
    }
    newUser.password = hashPassword(newUser.password);
    if (!newUser.name) {
      newUser.name = `${newUser.firstName} ${newUser.lastName}`;
    }
    const createdUser = await UserModel.add(newUser);
    if (!createdUser) {
      return null;
    }
    return createdUser;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (user: any, page: number, limit: number, query?: any) => {
  if (!user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  try {
    const parsedFilter = {};
    if (query.filter) {
      const filters = query.filter.split(';');
      filters.map((f) => {
        const [key, value] = f.split(':');
        if (key === 'role' && !isNaN(parseInt(value, 10))) {
          parsedFilter[key] = parseInt(value, 10);
        }
      });
    }
    const users = await UserModel.getUsers(page, limit, parsedFilter);
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: string, user: any) => {
  if (userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  try {
    const users = await UserModel.getById(userId, true);
    return users;
  } catch (error) {
    throw error;
  }
};

export const updateUserController = async (userId: string, payload: any, user: any) => {
  if (userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw createError(403, `You are not authorized to edit the user ${userId}`);
  }
  try {
    if (payload['password']) {
      const hashPass = hashPassword(payload['password']);
      payload['password'] = hashPass;
    }
    const response = await UserModel.updateUser(userId, payload);
    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string, user: any) => {
  if (!user.roles.includes(Role.Admin)) {
    throw createError(403, `You are not authorized to delete the user ${userId}`);
  }
  try {
    const response = await UserModel.deleteById(userId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (userId: string, user: any) => {
  // get all members from user collection
  if (userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  try {
    const response = await UserModel.getUsers;
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (userId: string, user: any, email: string) => {
  // get all members from user collection
  if (userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  const existingUser = await UserModel.getByEmail(email, false);
  if (existingUser) {
    return {
      existingUser,
    };
  }
};

export const getUserById = async (userId: string, user: any, id: string) => {
  // get all members from user collection
  const existingUser = await UserModel.getById(id, false);
  if (existingUser) {
    return {
      existingUser,
    };
  }
};
