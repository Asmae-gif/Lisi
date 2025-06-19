import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationError {
  field: string;
  message: string;
}

interface FormValidationProps {
  errors: ValidationError[];
  className?: string;
}

const FormValidation: React.FC<FormValidationProps> = ({ errors, className = "" }) => {
  if (errors.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {errors.map((error, index) => (
        <Alert key={index} className="border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{error.field}:</strong> {error.message}
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default FormValidation; 