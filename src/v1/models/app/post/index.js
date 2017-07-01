import mongoose from '../../../config/mongo';

import * as messages from '../../../config/messages';

const PostSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  readingTime: String,
  level: String,
  body: {
    type: String,
    required: true,
  },
  image: String,
},
  {
    strict: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

export function postModel() {
  return mongoose.model('Post', PostSchema);
}

const Post = postModel();

export function createPost(data) {
  return new Post(data)
    .save()
    .then(payload => payload)
    .catch((err) => {
      throw Object({ message: messages.CREATE_POST_FAILED, status: 422, payload: err });
    });
}

export function updatePost(user, postId, data) {
  const ObjectId = mongoose.Types.ObjectId;

  const { title, category, readingTime, level, body, image } = data;

  return Post.findOneAndUpdate(
    {
      _id: ObjectId(postId),
      ownerId: ObjectId(user._id),
    },
    {
      $set: {
        title,
        category,
        readingTime,
        level,
        body,
        image,
      },
    },
    {
      new: true,
      projection: {
        __v: 0,
      },
    })
    .then((result) => {
      if (!result) {
        throw Object({ message: messages.POST_NOT_FOUND, status: 422 });
      }
      return result;
    })
    .catch((err) => {
      throw Object(err);
    });
}

