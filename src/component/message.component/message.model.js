var { Schema } = require ( "mongoose");
var mongoose = require('mongoose');
var autoIncrement = require ( "mongoose-auto-increment");
const messageSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    title: {
      type: String
    },
    message: {
      type: String,
    },
    reply: [{
      type: Number,
      ref:'reply'
    }],
    deleted: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);



messageSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

  }
});
autoIncrement.initialize(mongoose.connection);
messageSchema.plugin(autoIncrement.plugin, { model: "message", startAt: 1 });
module.exports = mongoose.model("message", messageSchema);
