/**
 * Exceptions
 *
 * The exceptions that the Repository may throw/reject
 */
import { GraphQLError } from 'graphql';

/**
 * Parameter Error
 *
 * a given parameter does not have the correct structure.
 */
export class ParameterError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'PARAMETER_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'ParameterError' });
  }
}

/**
 * Access Error
 *
 * Not allowed to access the resource.
 */

export class AccessError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'ACCESS_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'AccessError' });
  }
}

/**
 * Integrity Error
 *
 * The operation would create a integrity issue and is rejected
 */

export class IntegrityError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'INTEGRITY_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'IntegrityError' });
  }
}

/**
 * Concurrency Error
 *
 * The operation is not possible because the instance is locked by another
 * process.
 */

export class ConcurrencyError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'CONCURRENCY_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'ConcurrencyError' });
  }
}
/**
 * Network Error
 *
 * The operation is not possible because a remote service did not respond
 */

export class NetworkError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'NETWORK_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'NetworkError' });
  }
}
