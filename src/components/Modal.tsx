import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <ModalOverlay>
      <ModalContainer ref={modalRef}>
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        <ModalContentWrapper>
          <ModalContent>{children}</ModalContent>
        </ModalContentWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background: rgba(20, 20, 35, 0.95);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 100001;
  
  @media (min-width: 768px) {
    width: 80%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  position: sticky;
  top: 0;
  background: rgba(20, 20, 35, 0.98);
  border-radius: 12px 12px 0 0;
  z-index: 10;
  
  @media (min-width: 768px) {
    padding: 1.5rem 2rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #ffd700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #c7bfd4;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffd700;
  }
`;

const ModalContentWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ModalContent = styled.div`
  color: #e2e8f0;
`;

export default Modal;
