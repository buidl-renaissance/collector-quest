import React from 'react';
import styled from '@emotion/styled';
import { Input, InputContainer } from './styled/forms';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Validates if a phone number has exactly 10 digits
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = '(XXX) XXX-XXXX',
  disabled = false,
}) => {
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    onChange(formattedPhone);
  };

  return (
    <InputContainer>
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={14}
        disabled={disabled}
        error={!!error}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

export default PhoneInput;
