import { useState, useCallback } from 'react';

interface FormState {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  handleChange: (name: keyof T, value: any) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  resetForm: () => void;
  validateField: (name: keyof T, value: any, rules: ValidationRule[]) => string | undefined;
  isValid: boolean;
}

interface ValidationRule {
  rule: (value: any) => boolean;
  message: string;
}

export const useForm = <T extends FormState>(initialValues: T, initialErrors: FormErrors = {}): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validateField = useCallback((name: keyof T, value: any, rules: ValidationRule[]): string | undefined => {
    for (const rule of rules) {
      if (!rule.rule(value)) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return rule.message;
      }
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
    return undefined;
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors(initialErrors);
  }, [initialValues, initialErrors]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
    isValid
  };
};