import { Request } from 'express';
import { buildSchema, ResolverData } from 'type-graphql';
import { UserResolver } from './auth/user.resolver';
import { PostResolver } from './post/post.resolver';

export const initSchema = buildSchema({
  resolvers: [UserResolver, PostResolver],
  emitSchemaFile: true,
  authChecker: (resolverData: ResolverData<Request>) =>
    resolverData?.context?.isAuthenticated
});


