var { Schema } = require ( "mongoose");
var mongoose = require('mongoose');
var autoIncrement = require ( "mongoose-auto-increment");
var bcrypt = require('bcryptjs');
const userSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["ADMIN", "GUEST"],
      required: true
    },
    username: {
      type: String
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

userSchema.methods.isValidPassword = function (newPassword, callback) {
  let user = this;
  bcrypt.compare(newPassword, user.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, { model: "user", startAt: 1 });
module.exports = mongoose.model("user", userSchema);
