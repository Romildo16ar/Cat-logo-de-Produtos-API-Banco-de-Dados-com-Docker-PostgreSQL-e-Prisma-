/** Erro de aplicacao que carrega o status HTTP a ser devolvido ao cliente. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, message, details);
  }

  static notFound(message: string) {
    return new HttpError(404, message);
  }
}
