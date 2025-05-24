import styled from "@emotion/styled";
// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: rgba(30, 20, 50, 0.95);
  border: 2px solid #bb8930;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(187, 137, 48, 0.3);
  width: 100%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
  background: rgba(30, 20, 50, 0.8);
  border-radius: 14px 14px 0 0;
`;

const ModalTitle = styled.h2`
  font-family: "Cinzel Decorative", serif;
  color: #bb8930;
  font-size: 1.75rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #e8e3f0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(187, 137, 48, 0.2);
    color: #bb8930;
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  padding: 2rem;
`;

export { ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalContent };
