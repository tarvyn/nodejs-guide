import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '../../models/user.model';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail(undefined, { message: 'Email is invalid' })
  email: string;

  @Field()
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;
}
