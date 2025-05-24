import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";
import { FaTimes } from "react-icons/fa";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: #2e1e0f;
  border-radius: 0.5rem;
  padding: 0;
  max-width: 42rem;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #a77d3e;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    width: 90%;
    max-height: 85vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #a77d3e;
  background-color: #2e1e0f;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ModalCloseButton = styled.button`
  color: #f5e6d3;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    color: #d6b87b;
    background-color: rgba(167, 125, 62, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.25rem;
    margin: -0.25rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-family: "Cinzel", serif;
  color: #d6b87b;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ModalBody = styled.div`
  color: #f5e6d3;
  padding: 1.5rem;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <FaTimes size={24} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export const useModal = () => {
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

  useEffect(() => {
    if (modalContent.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalContent.isOpen]);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({
      isOpen: true,
      title,
      content,
    });
  };

  const closeModal = () => {
    setModalContent((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    modalContent,
    openModal,
    closeModal,
    Modal,
  };
};

export default useModal;
