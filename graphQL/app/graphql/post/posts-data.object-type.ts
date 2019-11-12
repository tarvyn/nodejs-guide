import { Field, Int, ObjectType } from 'type-graphql';
import { Post } from '../../models/post.model';
import { PostObjectType } from './post.object-type';

@ObjectType()
export class PostsDataObjectType {
  @Field(type => Int)
  totalPosts: number;

  @Field(type => [PostObjectType])
  posts: Array<Post>;

}
