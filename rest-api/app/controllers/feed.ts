import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { PostModel } from '../models/post.model';
import { UserModel } from '../models/user.model';
import { io } from '../server';
import { catchPromiseError } from '../utils/catch-promise-error';
import { deleteImage } from '../utils/delete-image';

export const getPosts: RequestHandler = async (req, res, next) => {
  const page = req.query.page || 1;
  const postsPerPage = 2;
  const [getTotalPostsError, postsCount] = await catchPromiseError(PostModel.find().countDocuments());

  if (getTotalPostsError) {
    return next(new Error('Could not select posts amount.'))
  }

  const [getPostsError, posts] = await catchPromiseError(
    PostModel.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((page - 1) * postsPerPage)
      .limit(postsPerPage)
  );

  if (getPostsError) {
    return next(getPostsError);
  }

  res.status(200).json({ message: 'Posts fetched', posts, totalItems: postsCount });
};

export const getPost: RequestHandler = async (req, res, next) => {
  const { params: { postId } } = req;

  const [error, post] = await catchPromiseError(PostModel.findById(postId));

  if (error) {
    return next(error);
  }

  if (!post) {
    return next(new Error('Could not find a post.'))
  }

  res.status(200)
    .json({ message: 'Post fetched', post });
};

export const createPost: RequestHandler = async (req, res, next) => {
  const { body: { title, content }, file, userId } = req;
  const errors = validationResult(req);
  const [getUserError, user] = await catchPromiseError(UserModel.findById(userId));

  if (getUserError) {
    next('Cannot find a user');
  }

  if (!file) {
    next(new Error('No image provided.'));
  }
  const imageUrl = file.path.replace(/\\/g, '/');
  const postModel = new PostModel({ title, content, imageUrl, creator: userId });

  const [savePostError, post] = await catchPromiseError(postModel.save());

  user.posts.push(post);
  const [saveUserError] = await catchPromiseError(user.save());

  if (savePostError || saveUserError) {
    return next(new Error('Error when creating a post has occurred'));
  }

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed. Entered data is incorrect',
      errors: errors.array()
    });
  }

  io.emit('posts', {
    action: 'create', post: {
      ...((post as any)._doc),
      creator: {
        _id: userId,
        name: user.name
      }
    }
  });
  res.status(201).json({ message: 'Post created successfully', post });
};

export const updatePost: RequestHandler = async (req, res, next) => {
  const { body: { title, content, image }, file, params: { postId }, userId } = req;
  const errors = validationResult(req);

  if (!file && !image) {
    return res.status(422).json({
      message: 'Validation failed. Image was not specified.'
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed. Entered data is incorrect',
      errors: errors.array()
    });
  }

  const imageUrl = file ? file.path.replace(/\\/g, '/') : image;
  const [getPostError, postToUpdate] = await catchPromiseError(PostModel.findById(postId).populate('creator'));

  if (getPostError || !postToUpdate) {
    return next(new Error('Cannot find a post'));
  }

  if ((postToUpdate.creator as any)._id.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (imageUrl !== postToUpdate.imageUrl) {
    const [deleteFileError] = await catchPromiseError(deleteImage(postToUpdate.imageUrl));

    if (deleteFileError) {
      next(new Error('Error when deleting an image file occurred.'));
    }
  }

  Object.assign(postToUpdate, { title, content, imageUrl });
  const [error, post] = await catchPromiseError(postToUpdate.save());

  if (error) {
    return next(new Error('Error when updating a post has occurred'));
  }

  io.emit('posts', { action: 'update', post });
  res.status(201).json({ message: 'Post updated successfully', post });
};

export const deletePost: RequestHandler = async (req, res, next) => {
  const { params: { postId }, userId } = req;

  const [findPostError, post] = await catchPromiseError(PostModel.findById(postId));

  if (findPostError || !post) {
    next(new Error('Error when deleting a post occurred.'))
  }

  if (post.creator.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const [deleteFileError] = await catchPromiseError(deleteImage(post.imageUrl));

  if (deleteFileError) {
    next(new Error('Error when deleting an image file occurred.'));
  }

  const [deletePostError] = await catchPromiseError(PostModel.findByIdAndDelete(postId));

  if (deletePostError) {
    next(new Error('Error when deleting a post occurred.'));
  }

  const [findUserError, user] = await catchPromiseError(UserModel.findById(userId));

  (user as any).posts.pull(postId);

  const [saveUserError] = await catchPromiseError(user.save());

  if (findUserError || saveUserError) {
    return next(new Error('Cannot find or update user'));
  }

  io.emit('posts', { action: 'delete', postId });

  res.status(201).json({ message: 'Post deleted successfully' });
};

