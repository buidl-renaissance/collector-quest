import styled from "@emotion/styled";
// Button Components
const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #805ad5, #d53f8c);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #805ad5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #6b46c1;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #e2e8f0;
  border: 1px solid #4a5568;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export { SubmitButton, ButtonGroup, PrimaryButton, SecondaryButton };
