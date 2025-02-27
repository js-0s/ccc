import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import { asNexusMethod } from 'nexus';

export const DateMethod = asNexusMethod(GraphQLDate, 'dateOnly');
export const DateTimeMethod = asNexusMethod(GraphQLDateTime, 'date');
export const TimeMethod = asNexusMethod(GraphQLTime, 'time');
