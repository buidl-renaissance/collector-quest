import { keyframes } from "@emotion/react";

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const unfurl = keyframes`
  from { height: 0; opacity: 0; }
  to { height: 200px; opacity: 1; }
`;

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const spin3D = keyframes`
  0% {
    transform: rotateY(0deg) scale(0.3);
  }
  100% {
    transform: rotateY(360deg) scale(1);
  }
`;

export const glow = keyframes`
  0% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(187, 137, 48, 0.2);
  }
  50% {
    box-shadow: 0 4px 30px rgba(187, 137, 48, 0.5),
                0 0 40px rgba(187, 137, 48, 0.4),
                0 0 60px rgba(187, 137, 48, 0.2);
  }
  100% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(187, 137, 48, 0.2);
  }
`;

export const spinAndGlow = `
  animation: ${spin3D} 1s ease-in-out, ${glow} 3s ease-in-out infinite;
`;