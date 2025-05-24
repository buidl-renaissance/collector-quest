import React from "react";
import styled from "@emotion/styled";
import { FaTimes } from "react-icons/fa";
import { Relic } from "@/data/artifacts";
import RelicDisplay from "./RelicDisplay";
import { ModalOverlay, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalContent } from "./styled/modal";

interface RelicModalProps {
  isOpen: boolean;
  onClose: () => void;
  relic: Relic | null;
}

const RelicModal: React.FC<RelicModalProps> = ({ isOpen, onClose, relic }) => {
  if (!isOpen || !relic) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* <ModalHeader>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader> */}
        <ModalContent>
          <RelicDisplay relic={relic} />
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default RelicModal;
