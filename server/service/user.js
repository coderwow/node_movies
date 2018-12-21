import mongoose from 'mongoose';

const User = mongoose.model('User');

export const checkPassword = async (username, password) => {
  let isMatch = false;
  let user = await User.findOne({
    username
  });
  if (user) {
    isMatch = await user.comparePassword(password, user.password);
  }

  return {
    isMatch,
    user
  };
};
