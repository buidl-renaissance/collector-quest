import styled from "@emotion/styled";
import { FaQrcode, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { useState } from "react";
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

interface QRCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId?: string;
}

type Mode = 'scan' | 'share';

export const QRCharacterModal = ({ isOpen, onClose, characterId }: QRCharacterModalProps) => {
  const [mode, setMode] = useState<Mode>('scan');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      // Handle the scanned QR code data here
      console.log('Scanned:', data);
    }
  };

  const handleError = (err: Error) => {
    console.error(err);
  };

  return (
    <AnimatedModal
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent onClick={e => e.stopPropagation()}>
        <NavigationBar>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
          <SegmentedControl>
            <SegmentButton 
              active={mode === 'scan'} 
              onClick={() => setMode('scan')}
            >
              Scan
            </SegmentButton>
            <SegmentButton 
              active={mode === 'share'} 
              onClick={() => setMode('share')}
            >
              Share
            </SegmentButton>
          </SegmentedControl>
        </NavigationBar>
        
        <ContentContainer>
          {mode === 'share' ? (
            <ShareContainer>
              <QRCodeWrapper>
                <QRCode 
                  value={characterId || 'https://collectorquest.ai'}
                  size={300}
                  level="H"
                  fgColor="#d4af37"
                  bgColor="transparent"
                />
              </QRCodeWrapper>
              <ScannerText>
                Share this QR code with other players
              </ScannerText>
            </ShareContainer>
          ) : (
            <ScanContainer>
              <QrScannerWrapper>
                <Scanner
                  onError={(error: unknown) => handleError(error as Error)} 
                  onScan={(detectedCodes: IDetectedBarcode[]) => {
                    if (detectedCodes && detectedCodes.length > 0) {
                      handleScan(detectedCodes[0].rawValue);
                    }
                  }}
                  constraints={{
                    facingMode: "environment"
                  }}
                />
              </QrScannerWrapper>
              <ScannerText>
                {scanResult ? `Scanned: ${scanResult}` : 'Point your camera at a QR code'}
              </ScannerText>
            </ScanContainer>
          )}
        </ContentContainer>
      </ModalContent>
    </AnimatedModal>
  );
};

const AnimatedModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 90%;
  max-width: 500px;
  background: rgba(26, 26, 46, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(187, 137, 48, 0.3);
  overflow: hidden;
`;

const NavigationBar = styled.div`
  height: 60px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 1rem;
  background: transparent;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &:hover {
    color: #f5cc50;
  }
`;

const SegmentedControl = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 4px;
  margin: 0 auto;
  width: 200px;
`;

const SegmentButton = styled.button<{ active: boolean }>`
  flex: 1;
  background: ${props => props.active ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#d4af37' : 'transparent'};
  color: ${props => props.active ? '#d4af37' : 'rgba(255, 255, 255, 0.6)'};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #d4af37;
  }
`;

const ContentContainer = styled.div`
  padding: 2rem;
`;

const ShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const ScanContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
`;

const QrScannerWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const QRCodeWrapper = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const ScannerText = styled.p`
  color: #fff;
  text-align: center;
  margin: 0;
  font-size: 1rem;
`;
