import { IsNotEmpty, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Post } from '../../models/post.model';

@InputType()
export class PostInput implements Partial<Post> {
  @Field({ nullable: true })
  id?: string;

  @Field()
  @IsNotEmpty({ message: 'Title field is required' })
  title: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field()
  @MinLength(5, { message: 'Content should be at least 5 characters long' })
  content: string;
}
