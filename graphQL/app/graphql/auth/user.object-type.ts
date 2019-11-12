import { Field, ID, ObjectType } from 'type-graphql';
import { UserInfo } from '../../models/user.model';
import { PostObjectType } from '../post/post.object-type';

@ObjectType()
export class UserObjectType implements Partial<Omit<UserInfo, 'posts'>> {
  @Field(type => ID)
  _id: string;

  @Field(type => String)
  email: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  password: string;

  @Field(type => String)
  status: string;

  @Field(type => [PostObjectType])
  posts: Array<PostObjectType>;
}
