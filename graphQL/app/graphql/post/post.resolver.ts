import { Request } from 'express';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Post, PostModel } from '../../models/post.model';
import { UserModel } from '../../models/user.model';
import { catchPromiseError } from '../../utils/catch-promise-error';
import { deleteImage } from '../../utils/delete-image';
import { PostInput } from './post.input';
import { PostObjectType } from './post.object-type';
import { PostsDataInput } from './posts-data.input';
import { PostsDataObjectType } from './posts-data.object-type';

@Resolver(of => PostObjectType)
export class PostResolver {
  @Authorized()
  @Query(returns => PostsDataObjectType)
  async posts(@Arg('postsDataInput') { page = 1 }: PostsDataInput): Promise<PostsDataObjectType> {
    const postsPerPage = 2;
    const [getUserError, posts] = await catchPromiseError(
      PostModel.find()
        .sort({ createdAt: -1 })
        .populate('creator')
        .skip((page - 1) * postsPerPage)
        .limit(postsPerPage)
    );
    const [getTotalPostsError, totalPosts] = await catchPromiseError(
      PostModel.find().count()
    );

    if (getUserError || getTotalPostsError) {
      throw new Error('Could not find posts');
    }

    return { posts, totalPosts };
  }

  @Authorized()
  @Query(returns => PostObjectType)
  async post(@Arg('id') id: string): Promise<Post> {
    const [getPostError, post] = await catchPromiseError(
      PostModel.findById(id)
        .populate('creator')
    );

    if (getPostError) {
      throw getPostError;
    }

    if (!post) {
      throw new Error('Post was not found');
    }

    return post;
  }

  @Authorized()
  @Mutation(returns => PostObjectType)
  async savePost(
    @Arg('postInput') postInput: PostInput,
    @Ctx() { userId }: Request
  ): Promise<Post | undefined> {
    const { title, content, imageUrl, id } = postInput;
    const [getUserError, user] = await catchPromiseError(UserModel.findById(userId));

    let postToSave;

    if (getUserError) {
      throw new Error('Could not find a user');
    }

    if (id) {
      const [getPostError, post] = await catchPromiseError(
        PostModel.findById(id)
          .populate('creator')
      );

      if (getPostError || !post) {
        throw new Error('Could not find a post');
      }

      postToSave = Object.assign(post, { title, content, imageUrl });
    } else {
      postToSave = new PostModel({ title, content, imageUrl, creator: user })
    }

    const [error, post] = await catchPromiseError(postToSave.save());

    if (error) {
      throw error;
    }

    if (!id) {
      user.posts.push(post);
      await user.save();
    }

    return post;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() { userId }: Request
  ): Promise<boolean> {
    const [findPostError, post] = await catchPromiseError(PostModel.findById(id));

    if (findPostError || !post) {
      throw new Error('Error when deleting a post occurred.');
    }

    if (post.creator.toString() !== userId) {
      throw new Error('Not authorized');
    }

    const [deleteFileError] = await catchPromiseError(deleteImage(post.imageUrl));

    if (deleteFileError) {
      throw new Error('Error when deleting an image file occurred.');
    }

    const [deletePostError] = await catchPromiseError(PostModel.findByIdAndDelete(id));

    if (deletePostError) {
      throw new Error('Error when deleting a post occurred.');
    }

    const [findUserError, user] = await catchPromiseError(UserModel.findById(userId));

    (user as any).posts.pull(id);

    const [saveUserError] = await catchPromiseError(user.save());

    if (findUserError || saveUserError) {
      throw new Error('Cannot find or update user');
    }

    return true;
  }
}
