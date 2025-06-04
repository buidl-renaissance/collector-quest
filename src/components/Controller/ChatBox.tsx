import styled from "@emotion/styled";
import { FaMicrophone, FaPlay } from "react-icons/fa";

interface ChatBoxProps {
  onSendMessage?: (message: string) => void;
}

export const ChatBox = ({ onSendMessage }: ChatBoxProps) => {
  return (
    <ChatBoxContainer>
      <ChatBoxInner>
        <InputContainer>
          <InputField 
            as="textarea"
            placeholder="Type your response or command..." 
            title="Response Input"
          />
          <ButtonGroup>
            <RoundButton title="Voice Command">
              <FaMicrophone />
            </RoundButton>
            <RoundButton title="Confirm Action">
              <FaPlay />
            </RoundButton>
          </ButtonGroup>
        </InputContainer>
      </ChatBoxInner>
    </ChatBoxContainer>
  );
};

const ChatBoxContainer = styled.div`
  position: fixed;
  padding-right: 0.35rem;
  bottom: 60px; /* Match BottomNavigationBar height */
  left: 0rem;
  right: 4rem;
  width: auto;
  max-width: 400px;
  z-index: 0;
  transition: bottom 0.3s ease;

  @media (max-height: 400px) {
    bottom: 60px; /* Keep it above the navigation bar */
  }
`;

const ChatBoxInner = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: rgba(26, 26, 46, 0.95);
  border-radius: 999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 0.5rem;
  height: 62px;
`;

const InputField = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  color: #fff;
  font-size: 1rem;
  min-width: 0;
  resize: none;
  height: 48px;
  line-height: 1.2;
  overflow: hidden;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: center;
`;

const InputButton = styled.button`
  background: none;
  border: none;
  color: #d4af37;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    color: #f5cc50;
    transform: scale(1.1);
  }
`;

const RoundButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #d4af37;
  border: none;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f5cc50;
    transform: scale(1.1);
  }
`;
