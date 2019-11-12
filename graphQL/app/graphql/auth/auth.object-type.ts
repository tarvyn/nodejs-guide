import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AuthObjectType {
  @Field(type => String)
  userId: string;

  @Field(type => String)
  token: string;
}
