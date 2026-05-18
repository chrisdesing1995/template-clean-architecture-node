import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  type ApiResponseOptions,
} from '@nestjs/swagger';
import { ApiErrorDto } from '@shared/responses/api-error.dto';

interface ApiStandardSuccessResponseOptions {
  status?: number;
  description: string;
  isArray?: boolean;
}

export function ApiStandardResponse(
  model: Type<unknown> | undefined,
  options: ApiStandardSuccessResponseOptions,
): MethodDecorator & ClassDecorator {
  const decorators: Array<ClassDecorator | MethodDecorator> = [ApiExtraModels(ApiErrorDto)];
  const successStatus = options.status ?? 200;

  if (model) {
    decorators.push(ApiExtraModels(model));
  }

  decorators.push(
    ApiResponse({
      status: successStatus,
      description: options.description,
      schema: {
        type: 'object',
        properties: {
          traceId: {
            type: 'string',
            example: '2a5c9ed3-52f8-4b8f-b734-27ae3ca83d48',
          },
          success: {
            type: 'boolean',
            example: true,
          },
          code: {
            type: 'number',
            example: successStatus,
          },
          message: {
            type: 'string',
            example: 'Operation successful.',
          },
          data: model
            ? options.isArray
              ? {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath(model),
                  },
                }
              : {
                  $ref: getSchemaPath(model),
                }
            : {
                type: 'null',
                nullable: true,
                example: null,
              },
          errors: {
            type: 'null',
            nullable: true,
            example: null,
          },
        },
      },
    } satisfies ApiResponseOptions),
  );

  return applyDecorators(...decorators);
}

export function ApiStandardErrorResponse(
  status: number,
  description: string,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(ApiErrorDto),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          traceId: {
            type: 'string',
            example: '2a5c9ed3-52f8-4b8f-b734-27ae3ca83d48',
          },
          success: {
            type: 'boolean',
            example: false,
          },
          code: {
            type: 'number',
            example: status,
          },
          message: {
            type: 'string',
            example: 'Technical error.',
          },
          data: {
            type: 'null',
            nullable: true,
            example: null,
          },
          errors: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ApiErrorDto),
            },
          },
        },
      },
    }),
  );
}
