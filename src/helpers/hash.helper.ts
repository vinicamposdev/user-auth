import * as bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePasswords = (plainPass: string, hashword: string) => {
  return bcrypt.compareSync(plainPass, hashword);
};

export const getTokenFromHeader = (authorizationHeader: string) => {
  const token = authorizationHeader.split(' ')[1];
  return token;
};
