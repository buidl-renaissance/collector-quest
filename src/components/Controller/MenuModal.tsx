import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  bottom?: number;
}

export const MenuModal = ({ isOpen, onClose, title, children, bottom = 164 }: MenuModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <ModalContainer
            bottom={bottom}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{title.toUpperCase()}</ModalTitle>
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalContent>
              {children}
            </ModalContent>
          </ModalContainer>
        </>
      )}
    </AnimatePresence>
  );
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 8;
`;

const ModalContainer = styled(motion.div)<{ bottom: number }>`
  position: fixed;
  right: calc(44px + 1rem);
  bottom: ${props => props.bottom}px;
  width: calc(100% - 124px);
  background: rgba(26, 26, 46, 0.97);
  border: 1px solid #d4af37;
  max-height: 50vh;
  border-radius: 8px;
  z-index: 9;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #d4af37;
  font-size: 0.875rem;
  font-family: "Cinzel", serif;
  letter-spacing: 0.05em;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #f5cc50;
  }
`;

const ModalContent = styled.div`
  padding: 0.5rem;
  color: #fff;
  overflow-y: auto;
  flex-grow: 1;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`; 