import mongoose from '../../../config/mongo';
import { compare, hash } from '../../../config/crypto';
import { encode } from '../../../config/jwt';

import * as messages from '../../../config/messages';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['ADIM', 'PUBLISHER', 'USER'],
    default: 'USER',
  },
  avatar: String,
  facebook: String,
  twitter: String,
  gplus: String,
  linkedin: String,
  userStatus: {
    type: String,
    enum: ['PENDING', 'REQUESTED', 'ACCEPTED', 'DENIED', 'BLOCKED'],
    default: 'PENDING',
  },
},
  {
    strict: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

AdminSchema.pre('save', true, async function preSave(next, done) {
  try {
    if (this.password) {
      hash(this.password)
        .then((password) => {
          this.password = password;
          done();
        })
        .catch(e => done(e));
    }
    next();
  } catch (err) {
    next(err);
  }
});

export function userModel() {
  return mongoose.model('User', AdminSchema);
}

const User = userModel();

export function getUserById(userId) {
  const ObjectId = mongoose.Types.ObjectId;

  return User.findById(ObjectId(userId))
    .then(result => result)
    .catch((err) => {
      throw new Error({ payload: err, code: 500 });
    });
}

export function register(data) {
  return new User({ ...data, userStatus: 'PENDING' })
    .save()
    .then((payload) => {
      const user = payload.toObject();
      user.password = undefined;

      return { ...user, authorization: `Bearer ${encode(user)}` };
    })
    .catch((err) => { throw err; });
}

export function login(email, password) {
  return User
    .findOne({ email })
    .then(async (user) => {
      const validatePassword = await compare(password.toString(), user.password.toString());

      if (user && validatePassword) {
        const result = user.toObject();
        result.password = undefined;

        return { ...result, authorization: `Bearer ${encode(result)}` };
      }
      throw Object({ status: 500, payload: {} });
    })
    .catch((err) => {
      throw Object({ message: messages.LOGIN_FAILED, status: 422, payload: err });
    });
}

export function update(body, userId) {
  const ObjectId = mongoose.Types.ObjectId;

  return User.findOneAndUpdate({ _id: ObjectId(userId) }, { $set: body }, { new: true })
    .then(payload => payload)
    .catch((err) => {
      throw new Error({ message: messages.UPDATE_USER_FAILED, status: 422, payload: err });
    });
}
