import { useState, useEffect } from "react";
import styled from "@emotion/styled";

interface PinCodeProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const PinCode = ({ value, onChange, maxLength = 4, disabled = false }: PinCodeProps) => {
  const [pins, setPins] = useState<string[]>(Array(maxLength).fill(""));

  useEffect(() => {
    // Update pins array when value changes externally
    if (value) {
      const valueArray = value.split("").slice(0, maxLength);
      const newPins = [...Array(maxLength).fill("")];
      valueArray.forEach((digit, index) => {
        newPins[index] = digit;
      });
      setPins(newPins);
    } else {
      setPins(Array(maxLength).fill(""));
    }
  }, [value, maxLength]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;
    
    // Only allow numbers
    if (digit && !/^\d*$/.test(digit)) return;

    const newPins = [...pins];
    newPins[index] = digit;
    setPins(newPins);

    // Update the parent component with the new value
    onChange(newPins.join(""));

    // Auto-focus next input if a digit was entered
    if (digit && index < maxLength - 1) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !pins[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  return (
    <PinContainer>
      {pins.map((pin, index) => (
        <PinInput
          key={index}
          id={`pin-input-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={pin}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          autoComplete="off"
        />
      ))}
    </PinContainer>
  );
};

const PinContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
`;

const PinInput = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  border-radius: 5px;
  border: 1px solid #4a5568;
  background-color: #2d3748;
  color: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default PinCode;
