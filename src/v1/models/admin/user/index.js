import mongoose from '../../../config/mongo';

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  }
  }, 
  {
    strict: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  });

export function register(data) {
   return new User({ ...data, ...{ userStatus: 'PENDING' } })
    .save()
    .then(payload => payload)
    .catch(err => ({ payload: err, code: 500 }))
}