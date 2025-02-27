export class NetworkError extends Error {
  constructor(message: string) {
    super(message, { extensions: { code: 'NETWORK_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'NetworkError' });
  }
}
export class IntegrityError extends Error {
  constructor(message: string) {
    super(message, { extensions: { code: 'INTEGRITY_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'IntegrityError' });
  }
}
export class ParameterError extends Error {
  constructor(message: string) {
    super(message, { extensions: { code: 'PARAMETER_ERROR' } });

    Object.defineProperty(this, 'name', { value: 'ParameterError' });
  }
}
