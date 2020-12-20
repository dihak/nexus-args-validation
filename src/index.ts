import { UserInputError } from 'apollo-server';
import { plugin } from 'nexus'
import { printedGenTyping, printedGenTypingImport } from 'nexus/dist/core'
import * as yup from 'yup';

type yupType = typeof yup;

export type FieldValidationResolver = (
  yup: yupType
) => yup.AnyObjectSchema

const FieldValidationResolverImport = printedGenTypingImport({
  module: 'nexus-args-validation',
  bindings: ['FieldValidationResolver'],
})

const fieldDefTypes = printedGenTyping({
  optional: true,
  name: 'validation',
  description: `Validation Arguments with yup`,
  type: 'FieldValidationResolver',
  imports: [FieldValidationResolverImport],
})

export const nexusArgsValidation = () => plugin({
  name: 'Nexus Arguments Validation Plugin',
  description: 'Validate Arguments in Nexus using yup',
  fieldDefTypes: fieldDefTypes,
  onCreateFieldResolver(config) {
      const validation = config.fieldConfig.extensions?.nexus?.config.validation
      if (validation == null) {
        return
      }
      if (typeof validation !== 'function') {
        console.error(
          new Error(
            `The validation property provided to ${config.fieldConfig.name} with type ${
              config.fieldConfig.type
            } should be a function, saw ${typeof validation}`
          )
        )
        return
      }

      return function (root, args, ctx, info, next) {
        const schema: yup.AnyObjectSchema = validation(yup);
        try {
          schema.validateSync(args, {abortEarly: false});
          return next(root, args, ctx, info);
        } catch (error) {
          throw new UserInputError(error, error.errors)
        }
      }
  }
})
