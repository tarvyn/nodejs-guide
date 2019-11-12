import { compare, hash } from 'bcryptjs';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { secretKey } from '../../controllers/auth';
import { UserModel } from '../../models/user.model';
import { catchPromiseError } from '../../utils/catch-promise-error';
import { AuthObjectType } from './auth.object-type';
import { LoginInput } from './login.input';
import { UserInput } from './user.input';
import { UserObjectType } from './user.object-type';

@Resolver(of => UserObjectType)
export class UserResolver {
  @Query(returns => String)
  async status(@Ctx() { userId }: Request): Promise<string> {
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const [getUserError, {status}] = await catchPromiseError(UserModel.findById(userId));

    if (getUserError) {
      throw getUserError;
    }

    return status;
  }

  @Query(returns => AuthObjectType)
  async login(
    @Arg('loginInput') loginInput: LoginInput
  ): Promise<AuthObjectType> {
    const { password, email } = loginInput;

    const [getUserError, user] = await catchPromiseError(UserModel.findOne({ email }));
    const userId = user && user._id.toString();

    if (getUserError) {
      throw getUserError;
    }

    if (!user) {
      throw new Error('Cannot find user with such email');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new Error('Password is invalid');
    }

    const token = sign(
      { userId, email: user.email },
      secretKey,
      { expiresIn: '1h' }
    );

    return { token, userId };
  }

  @Mutation(returns => UserObjectType)
  async createUser(
    @Arg('userInput') userInput: UserInput
  ): Promise<UserObjectType | undefined> {
    const { name, password, email } = userInput;
    const [getUserError, existingUser] =
      await catchPromiseError(UserModel.findOne({ email }));

    if (getUserError) {
      throw new Error('Error when fetching user');
    }

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hash(password, 12);

    const userToCreate = new UserModel({ name, email, password: hashedPassword });

    const [saveUserError, user] = await catchPromiseError(userToCreate.save());

    if (saveUserError) {
      throw saveUserError;
    }

    return {
      ...user.toJSON(),
      _id: user._id.toString()
    };
  }

  @Mutation(returns => Boolean)
  async updateStatus(
    @Arg('status') status: string,
    @Ctx() { userId }: Request
  ): Promise<boolean> {
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const [getUserError, user] = await catchPromiseError(UserModel.findById(userId));

    if (getUserError) {
      throw getUserError;
    }

    Object.assign(user, { status });

    const [updateUserError] = await catchPromiseError(user.save());

    if (updateUserError) {
      throw updateUserError;
    }

    return true;
  }
}
