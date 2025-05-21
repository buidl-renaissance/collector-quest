import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaCrown } from "react-icons/fa";
import { fadeIn } from "./animations";

export const Container = styled.div<{ darkMode?: boolean }>`
  max-width: 1200px;
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

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const NavigationFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SelectionFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 46, 0.95);
  border-top: 2px solid #bb8930;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-size: 1.2rem;
  color: #c7bfd4;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const CrownIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #bb8930;
  animation: ${fadeIn} 1s infinite alternate;
`; 