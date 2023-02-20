import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import {
  createAnimal,
  deleteAnimalById,
  getAnimalByFirstName,
  getAnimalById,
  getAnimals,
  updateAnimalById,
} from '../../database/animals';

type Argument = {
  id: string;
};

type AnimalInput = {
  id: string;
  firstName: string;
  type: string;
  accessory: string;
};

type LoginArgument = {
  username?: string;
  password?: string;
};

type AnimalAuthenticationContext = {
  res: {
    setHeader: (setCookie: string, cookieValue: string) => void;
  };
};

type FakeAdminAnimalContext = {
  fakeAdminAnimal: { firstName: string } | undefined;
  req: { cookies: { fakeSessionToken: string } };
};

const typeDefs = gql`
  type Query {
    animals: [Animal]
    animal(id: ID!): Animal

    # Fake logged in animal
    getLoggedInAnimalByFirstName(firstName: String!): Animal
  }

  type Mutation {
    createAnimal(firstName: String!, type: String!, accessory: String): Animal

    deleteAnimalById(id: ID!): Animal

    updateAnimalById(
      id: ID!
      firstName: String!
      type: String!
      accessory: String
    ): Animal

    login(username: String!, password: String!): Animal
  }

  type Animal {
    id: ID!
    firstName: String
    type: String
    accessory: String
  }
`;

// Create fake serializedCookie for authentication
function createFakeSerializedCookie(firstName: string) {
  return `fakeSessionToken=${firstName}; HttpOnly; SameSite=lax; Path=/; Max-Age=3600`;
}

const resolvers = {
  Query: {
    animals: async () => {
      return await getAnimals();
    },

    animal: async (parent: string, args: Argument) => {
      return await getAnimalById(parseInt(args.id));
    },

    // Fake logged in animal resolver
    getLoggedInAnimalByFirstName: async (
      parent: string,
      args: { firstName: string },
    ) => {
      if (!args.firstName) {
        throw new GraphQLError('User must be logged in');
      }
      return await getAnimalByFirstName(args.firstName);
    },
  },

  Mutation: {
    createAnimal: async (parent: string, args: AnimalInput) => {
      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required field is missing');
      }
      return await createAnimal(args.firstName, args.type, args.accessory);
    },

    deleteAnimalById: async (
      parent: string,
      args: Argument,
      context: FakeAdminAnimalContext,
    ) => {
      if (
        context.fakeAdminAnimal?.firstName !==
        context.req.cookies.fakeSessionToken
      ) {
        throw new GraphQLError('Unauthorized operation');
      }

      return await deleteAnimalById(parseInt(args.id));
    },

    updateAnimalById: async (parent: string, args: AnimalInput) => {
      if (
        typeof args.firstName !== 'string' ||
        typeof args.type !== 'string' ||
        (args.accessory && typeof args.type !== 'string') ||
        !args.firstName ||
        !args.type
      ) {
        throw new GraphQLError('Required field missing');
      }

      return await updateAnimalById(
        parseInt(args.id),
        args.firstName,
        args.type,
        args.accessory,
      );
    },

    login: async (
      parent: string,
      args: LoginArgument,
      context: AnimalAuthenticationContext,
    ) => {
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field missing');
      }

      if (args.username !== 'Mayo' || args.password !== 'asdf') {
        throw new GraphQLError('Invalid username or password');
      }

      const fakeSerializedCookie = createFakeSerializedCookie(args.username);
      context.res.setHeader('Set-Cookie', fakeSerializedCookie);

      return await getAnimalByFirstName(args.username);
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const fakeAdminAnimal = await getAnimalByFirstName('Otto');
    return { req, res, fakeAdminAnimal };
  },
});
