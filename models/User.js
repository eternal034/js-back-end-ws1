const { Schema, model } = require('mongoose');
const { comparePassword, hashPassword } = require('../util/common');

const userSchema = new Schema({
  username: { type: String, required: true, minlength: 3 },
  hashedPassword: { type: String, required: true },
});

userSchema.index(
  { username: 1 },
  {
    unique: true,
    collation: {
      locale: 'en',
      strength: 2,
    },
  }
);

userSchema.methods.comparePassword = async function (password) {
  //hash and compare incoming password via bcrypt
  return await comparePassword(password, this.hashedPassword);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('hashedPassword')) {
    this.hashedPassword = await hashPassword(this.hashedPassword);
  }

  next();
});

const User = model('User', userSchema);

module.exports = User;
