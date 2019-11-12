import { Field, ID, ObjectType } from 'type-graphql';
import { PostInfo } from '../../models/post.model';
import { UserObjectType } from '../auth/user.object-type';

@ObjectType()
export class PostObjectType implements Partial<Omit<PostInfo, 'creator'>> {
  @Field(type => ID)
  _id: string;

  @Field(type => String)
  title: string;

  @Field(type => String, { nullable: true })
  imageUrl: string;

  @Field(type => String)
  content: string;

  @Field(type => UserObjectType)
  creator: UserObjectType;

  @Field(type => String)
  createdAt: string;

  @Field(type => String)
  updatedAt: string;
}
