import mongoose from '../../../config/mongo';

import * as messages from '../../../config/messages';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
},
  {
    strict: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

export function categoryModel() {
  return mongoose.model('Category', CategorySchema);
}

const Category = categoryModel();

export function create(data) {
  return new Category(data)
    .save()
    .then(payload => payload)
    .catch((err) => {
      throw Object({ message: messages.CREATE_CATEGORY_FAILED, status: 422, payload: err });
    });
}
