import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
  animation: ${keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `} 0.5s ease-out;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: #bb8930;
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${(props) => (props.error ? "#e74c3c" : "#3a3a5e")};
  border-radius: 4px;
  background-color: rgba(58, 51, 71, 0.3);
  color: #e0e0e0;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #bb8930;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #8a8a9a;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const InputButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #3a3a5e;
  color: #e0e0e0;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #bb8930;
    color: #1a1a2e;
  }
`;

export const InputButtonIcon = styled.span`
  font-size: 1.2rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #3a3a5e;
  border-radius: 4px;
  background-color: rgba(26, 26, 46, 0.7);
  color: #e0e0e0;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #bb8930;
  }

  &::placeholder {
    color: #8a8a9a;
  }
`;

export const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Chip = styled.div<{ selected?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${(props) =>
    props.selected ? "#bb8930" : "rgba(26, 26, 46, 0.7)"};
  color: ${(props) => (props.selected ? "#1a1a2e" : "#e0e0e0")};
  border: 1px solid ${(props) => (props.selected ? "#bb8930" : "#3a3a5e")};
  cursor: pointer;
  transition: all 0.3s;
  height: 42px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${(props) =>
      props.selected ? "#d4a959" : "rgba(58, 58, 94, 0.7)"};
  }
`;

export const CustomChipInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: rgba(26, 26, 46, 0.7);
  border: 1px solid #3a3a5e;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  padding-right: 0;
  transition: all 0.3s;
  height: 42px;
  width: fit-content;
  min-width: 160px;
  max-width: 200px;

  &:focus-within {
    border-color: #bb8930;
    background-color: rgba(58, 58, 94, 0.7);
  }
`;

export const CustomInput = styled.input`
  padding: 0;
  border: none;
  background: transparent;
  color: #e0e0e0;
  font-family: inherit;
  font-size: 0.9rem;
  flex: 1;
  height: 100%;
  line-height: 1;
  min-width: 80px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #8a8a9a;
  }
`;

export const AddChipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3a3a5e;
  color: #e0e0e0;
  border: none;
  cursor: pointer;
  margin-right: 4px;
  transition: all 0.3s;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background-color: #bb8930;
    color: #1a1a2e;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;


export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Checkbox = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #bb8930;
  border-radius: 4px;
  background: rgba(30, 20, 50, 0.5);
  cursor: pointer;
  position: relative;
  margin: 0;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:checked {
    background: #bb8930;
    border-color: #bb8930;
  }

  &:checked::after {
    content: "✓";
    position: absolute;
    color: #1a1a2e;
    font-size: 1.2rem;
    font-weight: bold;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: #d4a040;
    box-shadow: 0 0 10px rgba(187, 137, 48, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(187, 137, 48, 0.3);
  }
`;

export const CheckboxLabel = styled.label`
  color: #c7bfd4;
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: "Cormorant Garamond", serif;
  cursor: pointer;
  user-select: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
`;
