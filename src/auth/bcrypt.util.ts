import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const passwordMatch = async (
  password: string,
  userPassword: string,
): Promise<string> => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};
