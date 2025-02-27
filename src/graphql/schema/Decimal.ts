import { scalarType } from 'nexus';

export const DecimalScalar = scalarType({
  name: 'Decimal',
  asNexusMethod: 'decimal',
  description:
    'Decimal scalar type.' +
    ' This type is used to transport comma separated values as strings',
});
