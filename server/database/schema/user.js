import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { resolve } from "dns";
import { reject } from "any-promise";

const Schema = mongoose.Schema;
const { Mixed } = Schema.Types;
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

userSchema.virtual("islocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }

  if (!this.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

userSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (err) reject(err);
        else resolve(isMatch);
      });
    });
  },
  incLoginAttepts: () => {
    return new Promise((resolve,reject) => {
      if(this.lockUntil && this.lockUntil < Date.now()){
        this.update({
          $set:{
            loginAttempts: 1
          },
          $unset:{
            lockUntil: 1
          }
        }, err => {
          if(err) reject(err);
          else resolve(true);
        })
      }else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        };
        if((this.loginAttempts + 1) >= this.MAX_LOGIN_ATTEMPTS && !this.islocked){
          updates = {
            $set: {
              lockUntil : Date.now() + LOCK_TIME
            }
          }
        }
        this.update(updates, err => {
          if(err) reject(err);
          else resolve(true);
        })
      }
    })
  }
};

mongoose.model('User',userSchema);