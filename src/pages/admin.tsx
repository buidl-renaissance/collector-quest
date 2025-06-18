import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Link from "next/link";
import Head from "next/head";
import { FaPlus, FaUsers, FaUserTag, FaUserSecret, FaBook, FaUserCheck, FaToggleOn, FaToggleOff, FaFeather, FaCalendarAlt, FaGem, FaCrown, FaScroll, FaRing, FaUserAlt, FaMapMarkedAlt } from "react-icons/fa";
import useIsAdmin from "@/hooks/useIsAdmin";
import BottomNavigationBar from "@/components/BottomNavigationBar";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(58, 38, 6, 0.9) 0%, rgba(108, 58, 20, 0.9) 50%, rgba(58, 38, 6, 0.9) 100%);
  color: #e6e6e6;
  position: relative;
  overflow: hidden;
  font-family: "EB Garamond", "Merriweather", serif;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/collector-quest-background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.25;
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 4rem;
  padding-bottom: 120px;

  @media (min-width: 768px) {
    padding: 4rem 2rem 120px 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: "Cinzel Decorative", "Uncial Antiqua", serif;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const MagicSpan = styled.span`
  background: linear-gradient(90deg, #bb8930, #b6551c, #bb8930);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const AdminCard = styled(Link)`
  background: rgba(58, 38, 6, 0.7);
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid rgba(187, 137, 48, 0.3);
  backdrop-filter: blur(10px);
  text-decoration: none;
  color: #e6e6e6;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(187, 137, 48, 0.5);
    border-color: #bb8930;
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #bb8930;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
  color: #bb8930;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #e6e6e6;
  opacity: 0.8;
`;

const AdminToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(58, 38, 6, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.5);
  color: #bb8930;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    background: rgba(58, 38, 6, 1);
    box-shadow: 0 0 10px rgba(187, 137, 48, 0.5);
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-family: "Cinzel Decorative", "Uncial Antiqua", serif;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const AdminPage: React.FC = () => {
  const { isAdmin, toggleAdminMode } = useIsAdmin();
  
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Administrative dashboard for Collector Quest" />
      </Head>
      
      <PageWrapper>
        <Container>
          <Title>
            <MagicSpan>Administration Dashboard</MagicSpan>
          </Title>
          
          <AdminToggleButton onClick={toggleAdminMode}>
            {isAdmin ? (
              <>
                <FaToggleOn /> Admin Mode: Enabled
              </>
            ) : (
              <>
                <FaToggleOff /> Admin Mode: Disabled
              </>
            )}
          </AdminToggleButton>
          
          <Subtitle>Manage your game content</Subtitle>
          
          <AdminGrid>
            <AdminCard href="/create-story">
              <CardIcon>
                <FaPlus />
              </CardIcon>
              <CardTitle>Create Story</CardTitle>
              <CardDescription>
                Create new interactive stories for the realm
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/admin/artifacts">
              <CardIcon><FaScroll /></CardIcon>
              <CardTitle>Manage Artifacts</CardTitle>
              <CardDescription>Manage artifacts and their associated relics</CardDescription>
            </AdminCard>
            
            <AdminCard href="/admin/relics">
              <CardIcon><FaRing /></CardIcon>
              <CardTitle>Manage Relics</CardTitle>
              <CardDescription>Manage powerful relics and their properties</CardDescription>
            </AdminCard>
            
            <AdminCard href="/character/race/admin">
              <CardIcon>
                <FaUsers />
              </CardIcon>
              <CardTitle>Manage Races</CardTitle>
              <CardDescription>
                Add, edit, or remove character races
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/character/class/admin">
              <CardIcon>
                <FaUserTag />
              </CardIcon>
              <CardTitle>Manage Classes</CardTitle>
              <CardDescription>
                Add, edit, or remove character classes
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/admin/characters">
              <CardIcon><FaUserAlt /></CardIcon>
              <CardTitle>Manage Characters</CardTitle>
              <CardDescription>Manage characters and their details</CardDescription>
            </AdminCard>
            
            <AdminCard href="/admin/quests">
              <CardIcon><FaMapMarkedAlt /></CardIcon>
              <CardTitle>Manage Quests</CardTitle>
              <CardDescription>Manage quests and their objectives</CardDescription>
            </AdminCard>
            
            <AdminCard href="/events/admin">
              <CardIcon>
                <FaCalendarAlt />
              </CardIcon>
              <CardTitle>Manage Events</CardTitle>
              <CardDescription>
                Create and manage realm events and quests
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/realms/admin">
              <CardIcon>
                <FaCrown />
              </CardIcon>
              <CardTitle>Manage Realms</CardTitle>
              <CardDescription>
                Create and manage different realms
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/master">
              <CardIcon>
                <FaUserSecret />
              </CardIcon>
              <CardTitle>Master Controls</CardTitle>
              <CardDescription>
                Access advanced system controls and settings
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/pre-register">
              <CardIcon>
                <FaUserCheck />
              </CardIcon>
              <CardTitle>Pre-Registration</CardTitle>
              <CardDescription>
                Manage user pre-registrations for the gallery
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/realm">
              <CardIcon>
                <FaBook />
              </CardIcon>
              <CardTitle>View Realm</CardTitle>
              <CardDescription>
                Return to the main realm view
              </CardDescription>
            </AdminCard>
            
            <AdminCard href="/admin/locales">
              <CardIcon><FaMapMarkedAlt /></CardIcon>
              <CardTitle>Manage Locales</CardTitle>
              <CardDescription>View, create, edit, and generate map locales</CardDescription>
            </AdminCard>
          </AdminGrid>
        </Container>
        <BottomNavigationBar />
      </PageWrapper>
    </>
  );
};

export default AdminPage;
