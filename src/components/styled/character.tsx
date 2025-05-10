import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Link from "next/link";

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const unfurl = keyframes`
  from { height: 0; opacity: 0; }
  to { height: 200px; opacity: 1; }
`;

// Layout Components
export const Container = styled.div<{ darkMode?: boolean }>`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
  color: ${(props) => (props.darkMode ? "#E0DDE5" : "#333")};
  background-color: ${(props) => (props.darkMode ? "#1a1a2e" : "#f5f5f7")};
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

export const NavigationFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export const SelectionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

// Typography Components
export const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #c7bfd4;
  margin-bottom: 2rem;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #bb8930;
  margin-bottom: 1rem;
  border-bottom: 1px solid #3a3347;
  padding-bottom: 0.5rem;
`;

// Button Components
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

// Card Components
export const Card = styled.div<{ selected?: boolean }>`
  background-color: ${(props) => (props.selected ? "rgba(187, 137, 48, 0.2)" : "rgba(58, 51, 71, 0.2)")};
  border: 1px solid ${(props) => (props.selected ? "#bb8930" : "#3a3347")};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.1);
    border-color: #bb8930;
  }
`;

export const CardContent = styled.div`
  padding: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

export const CardDescription = styled.p`
  font-size: 1rem;
  color: #c7bfd4;
  line-height: 1.5;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

// Loading Components
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #e0e0e0;
`;

// Form Components
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #c7bfd4;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;

  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

// Chip Components
export const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Chip = styled.div<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.selected ? "rgba(187, 137, 48, 0.4)" : "rgba(58, 51, 71, 0.3)"};
  border: 1px solid ${(props) => (props.selected ? "#bb8930" : "#3a3347")};
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
    border-color: #bb8930;
  }
`;

// Error Components
export const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`; 