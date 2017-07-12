import mongoose from '../../../config/mongo';

import * as messages from '../../../config/messages';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  color: {
    type: String,
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

export function findByIdOrFindAll(categoryId) {
  if (categoryId) {
    const ObjectId = mongoose.Types.ObjectId;
    return Category.findById(ObjectId(categoryId))
      .then(result => result)
      .catch((err) => {
        throw new Error({ payload: err, code: 500 });
      });
  }

  return Category.find({})
  .then(result => result)
  .catch((err) => {
    throw new Error({ payload: err, code: 500 });
  });
}

export function update(body, categoryId) {
  const ObjectId = mongoose.Types.ObjectId;

  return Category.findOneAndUpdate({ _id: ObjectId(categoryId) }, { $set: body }, { new: true })
    .then(payload => payload)
    .catch((err) => {
      throw new Error({ message: messages.UPDATE_CATEGORY_FAILED, status: 422, payload: err });
    });
}

export function remove(categoryId) {
  const ObjectId = mongoose.Types.ObjectId;

  return Category.remove({ _id: ObjectId(categoryId) })
    .exec()
    .then(payload => payload)
    .catch((err) => {
      throw Object({ message: messages.REMOVE_CATEGORY_FAILED, status: 422, payload: err });
    });
}
