import imageType from 'image-type';
import mongoose from '../../../config/mongo';
import S3, { AWS_S3_BUCKET_NAME } from '../../../config/aws';
import * as messages from '../../../config/messages';

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

export async function createPost(data, file = null) {
  const postId = new mongoose.Types.ObjectId();
  const dataInsert = { ...data, _id: postId };

  if (file !== null) {
    const imgType = imageType(file.buffer);
    if (imgType === null) {
      throw new Error(messages.IMAGE_INVALID_FORMAT);
    }
    const imageKey = `img/${postId}.${imgType.ext}`;

    await S3.putObject({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: imageKey,
      Body: file.buffer,
      ContentType: imgType.mime,
      ACL: 'public-read',
    }).promise();

    dataInsert.image = imageKey;
  }

  return new Post(dataInsert)
    .save()
    .then(payload => payload)
    .catch(() => {
      throw new Error(messages.CREATE_POST_FAILED);
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

