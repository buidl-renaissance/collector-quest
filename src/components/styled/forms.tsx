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
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #bb8930;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #3a3a5e;
  border-radius: 4px;
  background-color: rgba(26, 26, 46, 0.7);
  color: #e0e0e0;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #bb8930;
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
  background-color: ${(props) => (props.selected ? "#bb8930" : "rgba(26, 26, 46, 0.7)")};
  color: ${(props) => (props.selected ? "#1a1a2e" : "#e0e0e0")};
  border: 1px solid ${(props) => (props.selected ? "#bb8930" : "#3a3a5e")};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#d4a959" : "rgba(58, 58, 94, 0.7)")};
  }
`;

export const CustomChipInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CustomInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #3a3a5e;
  border-radius: 4px;
  background-color: rgba(26, 26, 46, 0.7);
  color: #e0e0e0;
  font-family: inherit;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #bb8930;
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
  transition: background-color 0.3s;

  &:hover {
    background-color: #bb8930;
    color: #1a1a2e;
  }
`;
