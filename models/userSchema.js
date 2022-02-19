const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashpassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (normalPassword) {
    this._pasword = normalPassword;
    this.salt = uuidv1();
    this.hashpassword = this.genHash(normalPassword);
  })
  .get(() => {
    return this._pasword;
  });

userSchema.methods = {
  autheticate: function (normalPassword) {
    return this.genHash(normalPassword) === this.hashpassword;
  },

  genHash: function (normalPassword) {
    if (normalPassword) {
      try {
        return crypto
          .createHmac("sha256", this.salt)
          .update(normalPassword)
          .digest("hex");
      } catch (error) {
        return "";
      }
    } else {
      return "";
    }
  },
};

module.exports = mongoose.model("userSchema", userSchema);
