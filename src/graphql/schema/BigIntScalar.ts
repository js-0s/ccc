import { asNexusMethod, scalarType } from 'nexus';
import { Kind } from 'graphql';

// allow BigInt to be serialized to string in JSON fields
BigInt.prototype.toJSON = function () {
  const self: bigint = this as bigint;
  return self.toString();
};

export const BigIntScalar = asNexusMethod(
  scalarType({
    name: 'BigInt',
    asNexusMethod: 'bigInt',
    description: 'BigInt custom scalar type',
    parseValue(value) {
      return BigInt(value);
    },
    serialize(value: bigint) {
      return value.toString();
    },
    parseLiteral(ast: { kind: number; value: string }) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
        return BigInt(ast.value);
      }
      return null;
    },
  }),
  'bigInt',
);
