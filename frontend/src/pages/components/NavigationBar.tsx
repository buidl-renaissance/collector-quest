import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { FaPalette, FaUpload, FaUser } from "react-icons/fa";
import { useRouter } from "next/router";

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

const NavLink = styled.a`
  color: #a0aec0;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #805ad5;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
`;

const UserIcon = styled.div`
  background: rgba(128, 90, 213, 0.2);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #805ad5;
`;

const NavigationBar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if username is stored in localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Listen for storage events to update username if changed in another tab
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "username") {
        setUsername(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <NavContainer>
      {router.pathname !== "/" ? (
        <Link href="/">
          <Logo>
            <FaPalette /> Lord Smearington&apos;s Gallery
          </Logo>
        </Link>
      ) : (
        <Logo>
          <FaPalette /> Lord Smearington&apos;s Gallery
        </Logo>
      )}

      {username ? (
        <UserInfo>
          <UserIcon>
            <FaUser />
          </UserIcon>
          {username}
        </UserInfo>
      ) : (
        <NavLink href="/submit">
          <FaUser /> Sign In
        </NavLink>
      )}
    </NavContainer>
  );
};

export default NavigationBar;
