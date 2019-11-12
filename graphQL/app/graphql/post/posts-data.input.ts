import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class PostsDataInput {
  @Field(type => Int)
  @IsNotEmpty({ message: 'Page is not specified' })
  page: number;
}
