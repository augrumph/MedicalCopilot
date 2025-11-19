import { useState, useCallback } from 'react';

interface FormState {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormReturn {
  values: FormState;
  errors: FormErrors;
  handleChange: (name: string, value: any) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  resetForm: () => void;
  validateField: (name: string, value: any, rules: ValidationRule[]) => string | undefined;
  isValid: boolean;
}

interface ValidationRule {
  rule: (value: any) => boolean;
  message: string;
}

export const useForm = (initialValues: FormState = {}, initialErrors: FormErrors = {}): UseFormReturn => {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validateField = useCallback((name: string, value: any, rules: ValidationRule[]): string | undefined => {
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