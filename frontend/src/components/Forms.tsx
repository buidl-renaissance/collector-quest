import styled from "@emotion/styled";

// Form Components
const FormContainer = styled.form`
  background: rgba(26, 32, 44, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(45, 55, 72, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 2px rgba(128, 90, 213, 0.3);
  }

  &::placeholder {
    color: #718096;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(45, 55, 72, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 2px rgba(128, 90, 213, 0.3);
  }

  &::placeholder {
    color: #718096;
  }
`;

// Message Components
const ErrorMessage = styled.div`
  color: #fc8181;
  background: rgba(252, 129, 129, 0.1);
  border: 1px solid rgba(252, 129, 129, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

export { FormContainer, FormGroup, Label, Input, TextArea, ErrorMessage };
