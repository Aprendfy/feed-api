import imageType from 'image-type';
import S3, { AWS_S3_BUCKET_NAME } from '../config/aws';
import { IMAGE_INVALID_FORMAT } from '../config/messages';

const FIND_EXTENSION_REGEX = /\.[^/.]+$/;

export function getImagePath(buffer, name) {
  const nameWithoutExt = name.replace(FIND_EXTENSION_REGEX, '');
  const imgType = imageType(buffer);
  if (imgType === null) {
    throw new Error(IMAGE_INVALID_FORMAT);
  }
  const imagePath = `img/${nameWithoutExt}.${imgType.ext}`;
  return imagePath;
}

/**
 * @param {*} buffer Buffer da imagem que será feito o upload
 * @param {*} name Nome da imagem a ser salvo no bucket
 * @return imagePath Caminho da imagem no bucket
 */
export async function uploadImage(buffer, name) {
  const imgType = imageType(buffer);
  if (imgType === null) {
    throw new Error(IMAGE_INVALID_FORMAT);
  }

  const imagePath = getImagePath(buffer, name);

  await S3.putObject({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: imagePath,
    Body: buffer,
    ContentType: imgType.mime,
    ACL: 'public-read',
  }).promise();

  return imagePath;
}

export function deleteImage(path) {
  return S3.deleteObject({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: path,
  }).promise();
}

