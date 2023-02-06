import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm, UseFormHandleSubmit, UseFormProps, UseFormReturn } from 'react-hook-form'
import { BaseSyntheticEvent, useState } from "react";
import { boolean } from "zod";

export function useZodForm
  <
    TFieldValues extends FieldValues = FieldValues,
    TContext extends object = object
  >
  (props: {
    schema: z.ZodObject<z.ZodRawShape,"strip", z.ZodTypeAny,TFieldValues>,
    settings?: UseFormProps<TFieldValues, TContext>
  })
{  
  // Form and resolver
  const hookReturn = useForm<TFieldValues, TContext>({
    ...props.settings,
    resolver: zodResolver(props.schema),
  })
  
  // Error handling
  const formKeys = Object.keys(props.schema.keyof().Values)
  type FieldErrors = {
    [key in keyof TFieldValues]?: {
      error: boolean,
      message: string
    } | undefined;
  }
  const [ fieldErrors, setFieldsErrors ] = useState<FieldErrors>()


  const handleFieldErrors = (e:any) => {
    const fErrors: FieldErrors = {}
    Object.keys(e).forEach((k: keyof TFieldValues) => {
        if (formKeys.includes(k as string)) {
          fErrors[k] = {
            error: true,
            message: e[k].message
          }
        }
    })
    setFieldsErrors(fErrors)
    return Object.keys(fErrors).length !== 0 // true if there are errors
  }

  // Overwrite handler to handle Zod errors
  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (onValid, onInvalid?) => {
    return hookReturn.handleSubmit(
      (...args) => {
        handleFieldErrors({})
        onValid(...args)
      },
      (...args) => {
        handleFieldErrors(args[0])
        if (onInvalid) return onInvalid(...args)
      }
    )
  }
  return {
    ...hookReturn,
    fieldErrors,
    handleSubmit
  }
}
