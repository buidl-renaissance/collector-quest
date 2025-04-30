import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ModalContainerProps {
  children: ReactNode;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  onClose,
  onNext,
  onPrevious,
  showNavigation = true,
}) => {
  return (
    <ModalOverlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Content>
          <CloseButton onClick={onClose}>×</CloseButton>

          <ChildrenContainer>{children}</ChildrenContainer>
        </Content>

        {showNavigation && onPrevious && onNext && (
          <NavigationButtons>
            <NavButton onClick={onPrevious}>
              <FaArrowLeft /> Previous
            </NavButton>
            <NavButton onClick={onNext}>
              Next <FaArrowRight />
            </NavButton>
          </NavigationButtons>
        )}
      </Container>
    </ModalOverlay>
  );
};

export default ModalContainer;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Styled components
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(26, 32, 44, 0.95);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90vh;
  margin-bottom: 70px;
`;

const ChildrenContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  line-height: 1;

  &:hover {
    color: #805ad5;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  z-index: 1001;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #805ad5;
    transform: translateY(-2px);
  }
`;
