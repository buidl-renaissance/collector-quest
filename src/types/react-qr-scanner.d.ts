declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrScannerProps {
    onScan: (data: string | null) => void;
    onError: (error: Error) => void;
    style?: React.CSSProperties;
    constraints?: MediaTrackConstraints;
    delay?: number;
    facingMode?: string;
    resolution?: number;
    className?: string;
  }

  export default class QrScanner extends Component<QrScannerProps> {}
} 