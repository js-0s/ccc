import {
  objectType,
  extendType,
  nonNull,
  queryField,
  nullable,
  stringArg,
  idArg,
  list,
} from 'nexus';
import * as UserRepository from '@/graphql/repository/User';
import * as AuthRepository from '@/graphql/repository/Auth';
import {
  CoordinateType,
  CoordinateInputType,
} from '@/graphql/schema/Coordinate';
import type { ContextType } from '@/graphql/repository/Context';
import type { NexusGenArgTypes } from '@/graphql/schema-generated-types';
export const UserType = objectType({
  name: 'User',
  description:
    'A user is connected to every instance. It is used to check if there' +
    ' are enough permissions for mutations and if the user is allowed to' +
    ' access the information.',
  definition(t) {
    t.id('id', {
      description: 'Unique persistent identifier of the User.',
    });
    t.date('createdAt', {
      description: 'Date and time when this user was created.',
      // should be private: shield: AuthRepository.viewPrivateUserFields,
    });
    t.date('updatedAt', {
      description: 'Date and time when this user was updated.',
      // should be private: shield: AuthRepository.viewPrivateUserFields,
    });
    t.date('lastSigninAt', {
      description: 'Date and time when this user has last signed in.',
      resolve(parent, args, context: ContextType) {
        return UserRepository.getLastSigninAt({ ...context, parent });
      },
    });
    t.date('lastSignoutAt', {
      description: 'Date and time when this user has last signed out.',
      // should be private: shield: AuthRepository.viewPrivateUserFields,
    });
    t.string('name', {
      description:
        'Name of the user that is displayed in updatedBy fields. Usually' +
        ' filled on creation and provided by the authentication provider.' +
        ' This is information available to all signed in users.',
      resolve(parent, args, context: ContextType) {
        return UserRepository.getName({ ...context, parent });
      },
    });
    t.list.string('roles', {
      description: 'Roles of the user.',
      resolve(parent, args, context: ContextType) {
        return UserRepository.listRoles({ ...context, parent });
      },
    });
    t.list.field('chains', {
      type: 'Chain',
      description: 'Chains of the user.',
      resolve(parent, args, context: ContextType) {
        return UserRepository.listChains({ ...context, parent });
      },
    });
    t.string('email', {
      description:
        'Email address of the user. Provider by the authentication provider.' +
        ' Unique in the user-collection.',
    });
    t.string('phone', {
      description: 'A phone number to contact the user.',
    });
    t.boolean('disabled', {
      description: 'State the user is at.',
      // should be private: shield: AuthRepository.viewPrivateUserFields,
    });
    t.field('location', {
      type: CoordinateType,
      description: 'location of the user',
      resolve(parent, args, context: ContextType) {
        return UserRepository.getLocation({ ...context, parent });
      },
    });
  },
});

export const UserField = queryField('User', {
  type: UserType,
  description: 'Query to get a single User object by id or email.',
  args: {
    id: nullable(idArg()),
    email: nullable(stringArg()),
  },
  shield: AuthRepository.readAbility,
  resolve(root, args: NexusGenArgTypes['Query']['User'], context: ContextType) {
    return UserRepository.getUser({ ...args, ...context });
  },
});

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateUserName', {
      type: 'User',
      description: 'Change the name of the User',
      args: {
        name: nonNull(stringArg()),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['updateUserName'],
        context: ContextType,
      ) {
        return UserRepository.updateName({ ...context, ...args });
      },
    });
    t.field('updateUserPhone', {
      type: 'User',
      description: 'Change the phone of the User',
      args: {
        phone: nonNull(stringArg()),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['updateUserPhone'],
        context: ContextType,
      ) {
        return UserRepository.updatePhone({ ...context, ...args });
      },
    });
    t.field('updateUserEmail', {
      type: 'User',
      description: 'Change the email of the User',
      args: {
        email: nonNull(stringArg()),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['updateUserEmail'],
        context: ContextType,
      ) {
        return UserRepository.updateEmail({ ...context, ...args });
      },
    });
    t.field('updateUserPassword', {
      type: 'User',
      description: 'Change the password of the User',
      args: {
        currentPassword: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['updateUserPassword'],
        context: ContextType,
      ) {
        return UserRepository.updatePassword({
          ...context,
          ...args,
        });
      },
    });
    t.field('updateUserLocation', {
      type: 'User',
      description: 'Change the name of the User',
      args: {
        name: nonNull(CoordinateInputType),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['updateUserLocation'],
        context: ContextType,
      ) {
        return UserRepository.updateLocation({ ...context, ...args });
      },
    });
    t.field('updateUserRoles', {
      type: 'User',
      description: 'Change the role of the User',
      args: {
        roles: list(stringArg()),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['updateUserRoles'],
        context: ContextType,
      ) {
        return UserRepository.updateRoles({ ...context, ...args });
      },
    });
    t.field('addUserChain', {
      type: 'User',
      description: 'Add a Chain for the user',
      args: {
        chainId: stringArg(),
        publicKey: stringArg(),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['addUserChain'],
        context: ContextType,
      ) {
        return UserRepository.addChain({ ...context, ...args });
      },
    });
    t.field('removeUserChain', {
      type: 'User',
      description: 'Remove a chain of the user',
      args: {
        chainId: stringArg(),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['removeUserChain'],
        context: ContextType,
      ) {
        return UserRepository.removeChain({ ...context, ...args });
      },
    });
    t.field('refreshUserChains', {
      type: 'User',
      description: 'Refresh the chain balance from the on-chain data',
      args: {
        chainIdList: list(stringArg()),
      },
      shield: AuthRepository.updateAbility,
      resolve(
        _root,
        args: NexusGenArgTypes['Mutation']['refreshUserChains'],
        context: ContextType,
      ) {
        return UserRepository.refreshChains({ ...context, ...args });
      },
    });
  },
});
