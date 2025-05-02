import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
// import { FaPalette } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import { useHandle } from "@/hooks/useHandle";

// Styled components for the navigation bar
const NavContainer = styled.nav`
  background: linear-gradient(to right, #1a202c, #2d3748);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavigationBar = () => {
  const router = useRouter();
  const { handle, image } = useHandle();
  return (
    <NavContainer>
      {router.pathname !== "/" ? (
        <Link href="/">
          <Logo>
            {image ? (
              <Image src={image} alt="Logo" width={32} height={32} />
            ) : (
              <Image src="/canvas.png" alt="Logo" width={32} height={32} />
            )}
            {handle && <span>{handle}</span>}
          </Logo>
        </Link>
      ) : (
        <Logo>
          {image ? (
            <Image src={image} alt="Logo" width={32} height={32} />
          ) : (
            <Image src="/canvas.png" alt="Logo" width={32} height={32} />
          )}
          {handle && <span>{handle}</span>}
        </Logo>
      )}

      {/* <ConnectButton /> */}
    </NavContainer>
  );
};

export default NavigationBar;
