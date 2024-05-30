const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const mongoose_delete = require('mongoose-delete');

const userSchema = new mongoose.Schema({
  mssv: { type: String, required: true },
  name: String,
  email: String,
  address: { type: String, default: 'Hust' },
  sex: { type: String, enum: ["male", "female"], required: true, default: 'male' },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  description: Array,
});

userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
