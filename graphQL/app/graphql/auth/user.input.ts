import { Field, ID, InputType } from 'type-graphql';
import { User } from '../../models/user.model';
import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @IsNotEmpty({ message: 'Name field is required' })
  name: string;

  @Field()
  @IsEmail(undefined, { message: 'Email is invalid' })
  email: string;

  @Field()
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;
}
