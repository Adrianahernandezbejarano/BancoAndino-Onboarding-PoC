import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import { BadRequestError } from '../errors/HttpError';

type ClassType<T> = new (...args: unknown[]) => T;

export const validationMiddleware = <T>(
  dtoClass: ClassType<T>,
  property: 'body' | 'query' | 'params' = 'body'
): RequestHandler => {
  return async (req, _res, next) => {
    const dtoObject = plainToInstance(dtoClass, req[property]);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        field: error.property,
        constraints: error.constraints,
      }));

      return next(
        Object.assign(new BadRequestError('Error de validación'), {
          errors: formattedErrors,
        })
      );
    }

    req[property] = dtoObject;
    return next();
  };
};
