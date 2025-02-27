/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from 'gqty';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** BigInt custom scalar type */
  BigInt: { input: any; output: any };
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string };
  /** Decimal scalar type. This type is used to transport comma separated values as strings */
  Decimal: { input: any; output: any };
  /** JSON scalar type. This is a emergency-type when it is not feasible or possible to implement a graphql schema */
  JSON: { input: any; output: any };
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: { input: any; output: any };
}

/** Coordinate input parameter. */
export interface CoordinateInput {
  /** accuracy of the coordinate. optional. null means unknown, smaller numbers are more accurate. The radius of uncertainty for the location, measured in meters. */
  accuracy?: InputMaybe<Scalars['Float']['input']>;
  /** altitude of the coordinate. optional */
  altitude?: InputMaybe<Scalars['Float']['input']>;
  /** latitude of the coordinate. optional, takes precedence over lnglat */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Longitude and latitude separated by comma. */
  lnglat?: InputMaybe<Scalars['String']['input']>;
  /** longitude of the coordinate. optional, takes precedence over lnglat */
  longitude?: InputMaybe<Scalars['Float']['input']>;
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  BigInt: true,
  Boolean: true,
  Date: true,
  DateTime: true,
  Decimal: true,
  Float: true,
  ID: true,
  Int: true,
  JSON: true,
  String: true,
  Time: true,
};
export const generatedSchema = {
  Chain: {
    __typename: { __type: 'String!' },
    chainId: { __type: 'String' },
    id: { __type: 'ID' },
    lastBalance: { __type: 'Int' },
    lastCheckAt: { __type: 'DateTime' },
    publicKey: { __type: 'String' },
  },
  Coordinate: {
    __typename: { __type: 'String!' },
    accuracy: { __type: 'Float' },
    altitude: { __type: 'Float' },
    createdAt: { __type: 'DateTime' },
    latitude: { __type: 'Float' },
    lnglat: { __type: 'String' },
    longitude: { __type: 'Float' },
    updatedAt: { __type: 'DateTime' },
  },
  CoordinateInput: {
    accuracy: { __type: 'Float' },
    altitude: { __type: 'Float' },
    latitude: { __type: 'Float' },
    lnglat: { __type: 'String' },
    longitude: { __type: 'Float' },
  },
  JSONResult: { __typename: { __type: 'String!' }, json: { __type: 'JSON' } },
  User: {
    __typename: { __type: 'String!' },
    chains: { __type: '[Chain]' },
    createdAt: { __type: 'DateTime' },
    disabled: { __type: 'Boolean' },
    email: { __type: 'String' },
    id: { __type: 'ID' },
    lastSigninAt: { __type: 'DateTime' },
    lastSignoutAt: { __type: 'DateTime' },
    location: { __type: 'Coordinate' },
    name: { __type: 'String' },
    phone: { __type: 'String' },
    roles: { __type: '[String]' },
    updatedAt: { __type: 'DateTime' },
  },
  mutation: {
    __typename: { __type: 'String!' },
    addUserChain: {
      __type: 'User',
      __args: { chainId: 'String', publicKey: 'String' },
    },
    broadcastChainSignedTransaction: {
      __type: 'JSONResult',
      __args: { chainId: 'String!', signedTransactionBase64: 'String!' },
    },
    refreshUserChains: { __type: 'User', __args: { chainIdList: '[String]' } },
    removeUserChain: { __type: 'User', __args: { chainId: 'String' } },
    requestAccountNumberAndSequence: {
      __type: 'JSONResult',
      __args: { chainId: 'String!', senderAddress: 'String!' },
    },
    updateUserEmail: { __type: 'User', __args: { email: 'String!' } },
    updateUserLocation: {
      __type: 'User',
      __args: { name: 'CoordinateInput!' },
    },
    updateUserName: { __type: 'User', __args: { name: 'String!' } },
    updateUserPassword: {
      __type: 'User',
      __args: { currentPassword: 'String!', password: 'String!' },
    },
    updateUserPhone: { __type: 'User', __args: { phone: 'String!' } },
    updateUserRoles: { __type: 'User', __args: { roles: '[String]' } },
  },
  query: {
    __typename: { __type: 'String!' },
    User: { __type: 'User', __args: { email: 'String', id: 'ID' } },
    branch: { __type: 'String' },
    version: { __type: 'String' },
  },
  subscription: {},
} as const;

/**
 * A Chain is connected to a user and stores the public key along with the latest acquired balance
 */
export interface Chain {
  __typename?: 'Chain';
  /**
   * chain identifier, should be connected with the client-Chain.
   */
  chainId?: Maybe<ScalarsEnums['String']>;
  /**
   * Unique persistent identifier of the Chain.
   */
  id?: Maybe<ScalarsEnums['ID']>;
  /**
   * Last known balance of the Chain Address.
   */
  lastBalance?: Maybe<ScalarsEnums['Int']>;
  /**
   * Date and time when this Chain was last synced.
   */
  lastCheckAt?: Maybe<ScalarsEnums['DateTime']>;
  /**
   * Public key as received from the client-Chain.
   */
  publicKey?: Maybe<ScalarsEnums['String']>;
}

/**
 * Coordinates are a lnglat string (longitude and latitude separated by comma) that are used in the Location Object. These coordinates use longitude, latitude coordinate order (as opposed to latitude, longitude) to match the GeoJSON specification, which is equivalent to the OGC:CRS84 coordinate reference system. in addition latitude, longitude, altitude and accuracy may be specified and are converted appropriately.
 */
export interface Coordinate {
  __typename?: 'Coordinate';
  /**
   * accuracy of the coordinate.
   */
  accuracy?: Maybe<ScalarsEnums['Float']>;
  /**
   * altitude of the coordinate.
   */
  altitude?: Maybe<ScalarsEnums['Float']>;
  /**
   * Date and time when this coordinate was created.
   */
  createdAt?: Maybe<ScalarsEnums['DateTime']>;
  /**
   * latitude of the coordinate.
   */
  latitude?: Maybe<ScalarsEnums['Float']>;
  /**
   * longitude and latitude separated by comma.
   */
  lnglat?: Maybe<ScalarsEnums['String']>;
  /**
   * longitude of the coordinate.
   */
  longitude?: Maybe<ScalarsEnums['Float']>;
  /**
   * Date and time when this coordinate was last updated.
   */
  updatedAt?: Maybe<ScalarsEnums['DateTime']>;
}

/**
 * Result of a mutation that returns only one field of type JSON
 */
export interface JSONResult {
  __typename?: 'JSONResult';
  /**
   * result of a mutation
   */
  json?: Maybe<ScalarsEnums['JSON']>;
}

/**
 * A user is connected to every instance. It is used to check if there are enough permissions for mutations and if the user is allowed to access the information.
 */
export interface User {
  __typename?: 'User';
  /**
   * Chains of the user.
   */
  chains?: Maybe<Array<Maybe<Chain>>>;
  /**
   * Date and time when this user was created.
   */
  createdAt?: Maybe<ScalarsEnums['DateTime']>;
  /**
   * State the user is at.
   */
  disabled?: Maybe<ScalarsEnums['Boolean']>;
  /**
   * Email address of the user. Provider by the authentication provider. Unique in the user-collection.
   */
  email?: Maybe<ScalarsEnums['String']>;
  /**
   * Unique persistent identifier of the User.
   */
  id?: Maybe<ScalarsEnums['ID']>;
  /**
   * Date and time when this user has last signed in.
   */
  lastSigninAt?: Maybe<ScalarsEnums['DateTime']>;
  /**
   * Date and time when this user has last signed out.
   */
  lastSignoutAt?: Maybe<ScalarsEnums['DateTime']>;
  /**
   * location of the user
   */
  location?: Maybe<Coordinate>;
  /**
   * Name of the user that is displayed in updatedBy fields. Usually filled on creation and provided by the authentication provider. This is information available to all signed in users.
   */
  name?: Maybe<ScalarsEnums['String']>;
  /**
   * A phone number to contact the user.
   */
  phone?: Maybe<ScalarsEnums['String']>;
  /**
   * Roles of the user.
   */
  roles?: Maybe<Array<Maybe<ScalarsEnums['String']>>>;
  /**
   * Date and time when this user was updated.
   */
  updatedAt?: Maybe<ScalarsEnums['DateTime']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  /**
   * Add a Chain for the user
   */
  addUserChain: (args?: {
    chainId?: Maybe<ScalarsEnums['String']>;
    publicKey?: Maybe<ScalarsEnums['String']>;
  }) => Maybe<User>;
  /**
   * Broadcast a signed transaction to the network.
   */
  broadcastChainSignedTransaction: (args: {
    chainId: ScalarsEnums['String'];
    signedTransactionBase64: ScalarsEnums['String'];
  }) => Maybe<JSONResult>;
  /**
   * Refresh the chain balance from the on-chain data
   */
  refreshUserChains: (args?: {
    chainIdList?: Maybe<Array<Maybe<ScalarsEnums['String']>>>;
  }) => Maybe<User>;
  /**
   * Remove a chain of the user
   */
  removeUserChain: (args?: {
    chainId?: Maybe<ScalarsEnums['String']>;
  }) => Maybe<User>;
  /**
   * Request account number and sequence required to sign by the client-wallet
   */
  requestAccountNumberAndSequence: (args: {
    chainId: ScalarsEnums['String'];
    senderAddress: ScalarsEnums['String'];
  }) => Maybe<JSONResult>;
  /**
   * Change the email of the User
   */
  updateUserEmail: (args: { email: ScalarsEnums['String'] }) => Maybe<User>;
  /**
   * Change the name of the User
   */
  updateUserLocation: (args: { name: CoordinateInput }) => Maybe<User>;
  /**
   * Change the name of the User
   */
  updateUserName: (args: { name: ScalarsEnums['String'] }) => Maybe<User>;
  /**
   * Change the password of the User
   */
  updateUserPassword: (args: {
    currentPassword: ScalarsEnums['String'];
    password: ScalarsEnums['String'];
  }) => Maybe<User>;
  /**
   * Change the phone of the User
   */
  updateUserPhone: (args: { phone: ScalarsEnums['String'] }) => Maybe<User>;
  /**
   * Change the role of the User
   */
  updateUserRoles: (args?: {
    roles?: Maybe<Array<Maybe<ScalarsEnums['String']>>>;
  }) => Maybe<User>;
}

export interface Query {
  __typename?: 'Query';
  /**
   * Query to get a single User object by id or email.
   */
  User: (args?: {
    email?: Maybe<ScalarsEnums['String']>;
    id?: Maybe<ScalarsEnums['ID']>;
  }) => Maybe<User>;
  /**
   * Return deployed backend version.
   */
  branch?: Maybe<ScalarsEnums['String']>;
  /**
   * Return deployed backend version.
   */
  version?: Maybe<ScalarsEnums['String']>;
}

export interface Subscription {
  __typename?: 'Subscription';
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]['output']
    : never;
} & {};
