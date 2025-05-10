import styled from "@emotion/styled";
import Link from "next/link";

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #d4a959;
  }
`;

export const NextButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    background-color: #d4a959;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

export const GenerateButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4a959;
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: #bb8930;
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: #d4a959;
  }
`; 