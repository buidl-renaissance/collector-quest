import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { FaUser, FaGem, FaScroll, FaTrophy, FaCog } from "react-icons/fa";
import useIsAdmin from "@/hooks/useIsAdmin";

const BottomNavigationBar: React.FC = () => {
  const router = useRouter();
  const { isAdmin } = useIsAdmin();

  const handleCharacterClick = (e: React.MouseEvent) => {
    if (router.pathname.startsWith("/character")) {
      e.preventDefault();
      router.push("/characters");
    }
  };

  const navItems = [
    {
      href: "/character",
      icon: FaUser,
      label: "Character",
      isActive: router.pathname.startsWith("/character"),
      onClick: handleCharacterClick,
    },
    {
      href: "/artifacts",
      icon: FaGem,
      label: "Artifacts",
      isActive: router.pathname.startsWith("/artifacts"),
    },
    {
      href: "/relics",
      icon: FaTrophy,
      label: "Relics",
      isActive: router.pathname.startsWith("/relics"),
    },
    {
      href: "/quests",
      icon: FaScroll,
      label: "Quests",
      isActive: router.pathname.startsWith("/quests"),
    },
  ];

  if (isAdmin) {
    navItems.push({
      href: "/admin",
      icon: FaCog,
      label: "Admin",
      isActive: router.pathname.startsWith("/admin"),
    });
  }

  return (
    <NavigationContainer>
      <NavigationBar>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            isActive={item.isActive}
            onClick={item.onClick}
          >
            <NavIcon>
              <item.icon />
            </NavIcon>
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
      </NavigationBar>
    </NavigationContainer>
  );
};

export default BottomNavigationBar;

const NavigationContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(30, 20, 50, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(187, 137, 48, 0.3);
  padding: 0.5rem 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
  overflow-x: auto;
  overflow-y: hidden;

  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 640px) {
    padding: 0.75rem 0;
  }
`;

const NavigationBar = styled.nav`
  display: flex;
  align-items: center;
  min-width: 100%;
  padding: 0 1rem;
  gap: 0;

  @media (max-width: 640px) {
    padding: 0 0.5rem;
  }
`;

const NavItem = styled(Link)<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-width: 25%;
  flex: 0 0 25%;
  transition: all 0.3s ease;
  cursor: pointer;
  color: ${(props) => (props.isActive ? "#bb8930" : "#e8e3f0")};
  background: ${(props) =>
    props.isActive ? "rgba(187, 137, 48, 0.1)" : "transparent"};
  border: 1px solid
    ${(props) => (props.isActive ? "rgba(187, 137, 48, 0.3)" : "transparent")};

  &:hover {
    color: #bb8930;
    background: rgba(187, 137, 48, 0.1);
    border-color: rgba(187, 137, 48, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.75rem;
    gap: 0.125rem;
  }
`;

const NavIcon = styled.div`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const NavLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Cormorant Garamond", serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 640px) {
    font-size: 0.625rem;
  }
`;
