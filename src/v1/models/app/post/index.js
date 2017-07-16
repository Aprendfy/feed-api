import mongoose from '../../../config/mongo';
import * as messages from '../../../config/messages';
import { uploadImage, deleteImage } from '../../../util/imageUpload';

const DEFAULT_AUTHOR_PROJECTION = {
  'author._id': 1,
  'author.name': 1,
  'author.avatar': 1,
};
const DEFAULT_POST_PROJECTION = {
  title: 1,
  category: 1,
  readingTime: 1,
  level: 1,
  body: 1,
  image: 1,
};

const POST_BY_ID_USER_CAN_EDIT = (postId, userId) => ({
  _id: mongoose.Types.ObjectId(postId),
  ownerId: mongoose.Types.ObjectId(userId),
});

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

export async function createPost(data, file) {
  const postId = new mongoose.Types.ObjectId();
  const dataInsert = { ...data, _id: postId };
  if (typeof file !== 'undefined') {
    dataInsert.image = await uploadImage(file.buffer, postId.toString());
  }

  return new Post(dataInsert)
    .save()
    .then(payload => payload)
    .catch(() => {
      throw new Error(messages.CREATE_POST_FAILED);
    });
}

export async function updatePost(user, postId, data, file) {
  const { title, category, readingTime, level, body } = data;
  let { image } = data;

  const post = await Post.findOne(
    POST_BY_ID_USER_CAN_EDIT(postId, user._id),
    {
      _id: 1,
      image: 1,
    });

  if (typeof file !== 'undefined' && post !== null) {
    if (typeof post.image !== 'undefined' && !post.image.startsWith('http')) {
      await deleteImage(post.image);
    }
    image = await uploadImage(file.buffer, postId.toString());
  }

  return Post.findOneAndUpdate(
    POST_BY_ID_USER_CAN_EDIT(postId, user._id),
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
      projection: DEFAULT_POST_PROJECTION,
    })
    .then((result) => {
      if (result === null) {
        throw new Error({ message: messages.POST_NOT_FOUND, status: 422 });
      }
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function getPost(postId) {
  const ObjectId = mongoose.Types.ObjectId;

  return Post.aggregate([
    {
      $match: {
        _id: ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'ownerId',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $unwind: '$author',
    },
    {
      $project: { ...DEFAULT_POST_PROJECTION, ...DEFAULT_AUTHOR_PROJECTION },
    },
  ])
    .then((result) => {
      if (result.length === 0) {
        throw new Error(messages.POST_NOT_FOUND);
      }
      return result[0];
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function getPosts(category, $skip = 0, $limit = 20) {
  return Post.aggregate([
    {
      $match: {
        category,
      },
    },
    { $skip },
    { $limit },
    {
      $lookup: {
        from: 'users',
        localField: 'ownerId',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $unwind: '$author',
    },
    {
      $project: { ...DEFAULT_POST_PROJECTION, ...DEFAULT_AUTHOR_PROJECTION },
    },
  ])
    .then(result => result)
    .catch((err) => {
      throw new Error(err);
    });
}

