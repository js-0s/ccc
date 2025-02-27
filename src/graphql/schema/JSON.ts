import { scalarType, objectType } from 'nexus';

export const JSONScalar = scalarType({
  name: 'JSON',
  asNexusMethod: 'json',
  description:
    'JSON scalar type.' +
    ' This is a emergency-type when it is not feasible or possible to' +
    ' implement a graphql schema',
});

export const JSONResultType = objectType({
  name: 'JSONResult',
  description: 'Result of a mutation that returns only one field of type JSON',
  definition(t) {
    t.field('json', { type: 'JSON', description: 'result of a mutation' });
  },
});
