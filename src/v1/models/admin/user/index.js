import mongoose from '../../../config/mongo';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ADIM', 'PUBLISHER', 'USER'],
    default: 'USER'
  },
  avatar: String,
  facebook: String,
  twitter: String,
  gplus: String,
  linkedin: String,
  userStatus: {
    type: String,
    enum: ['PENDING', 'REQUESTED', 'ACCEPTED', 'DENIED', 'BLOCKED'],
    default: 'PENDING'
  }
  }, 
  {
    strict: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  });

export function userModel() {
  return mongoose.model('User', AdminSchema);
}

export function register(data) {
   return new User({ ...data, ...{ userStatus: 'PENDING' } })
    .save()
    .then(payload => payload)
    .catch(err => ({ payload: err, code: 500 }))
}