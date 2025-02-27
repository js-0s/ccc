import { makeSchema } from 'nexus';
import { nexusShield } from 'nexus-shield';
import path from 'path';

import { AccessError } from '@/graphql/repository/Error';
import * as AuthRepository from './repository/Auth';

// generic types
import * as Coordinate from './schema/Coordinate';
import * as DateTimeMethods from './schema/DateTime';
import * as DecimalScalar from './schema/Decimal';
import * as JSONScalar from './schema/JSON';
import * as BigIntScalar from './schema/BigIntScalar';

// core types
import * as UserTypes from './schema/User';

// app types
import * as QueryTypes from './schema/Query';
import * as ChainTypes from './schema/Chain';

const types = [
  // generic types
  Coordinate,
  DateTimeMethods,
  DecimalScalar,
  JSONScalar,
  BigIntScalar,

  // core business types
  UserTypes,

  // app types
  QueryTypes,
  ChainTypes,
];

// sanity check: the nexus error is very un-helpful when one of the
// types is undefined, this gives you a better hint
let allDefined = true;
for (let index = 0; index < types.length; index++) {
  if (typeof types[index] === 'undefined') {
    console.error(
      `${index} type undefined after:`,
      index > 0 ? types[index - 1] : 'first',
    );
    allDefined = false;
  }
}
if (!allDefined) {
  throw new Error('Graphql Schema Definition bad import');
}
// nexus schema from imported types
export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join('/app/src/graphql/schema.graphql'),
    typegen: path.join('/app/src/graphql/schema-generated-types.d.ts'),
  },
  plugins: [
    nexusShield({
      defaultError: new AccessError('Not allowed (default)'),
      defaultRule: AuthRepository.isAuthenticated,
    }),
  ],
  features: {
    abstractTypeStrategies: {
      resolveType: false,
      isTypeOf: true,
      __typename: true,
    },
  },
});
