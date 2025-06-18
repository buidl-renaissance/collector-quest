import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Head from 'next/head';
import { FaPlus, FaEdit, FaTrash, FaMagic, FaMapMarkedAlt, FaEye, FaSave, FaTimes } from 'react-icons/fa';
import { Locale, LocaleType } from '@/data/locales';
import BottomNavigationBar from '@/components/BottomNavigationBar';

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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => {
    switch (props.variant) {
      case 'danger': return 'rgba(139, 0, 0, 0.8)';
      case 'secondary': return 'rgba(58, 38, 6, 0.8)';
      default: return 'rgba(187, 137, 48, 0.8)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'danger': return 'rgba(255, 0, 0, 0.5)';
      case 'secondary': return 'rgba(187, 137, 48, 0.5)';
      default: return 'rgba(187, 137, 48, 0.8)';
    }
  }};
  color: #e6e6e6;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'danger': return 'rgba(139, 0, 0, 1)';
        case 'secondary': return 'rgba(58, 38, 6, 1)';
        default: return 'rgba(187, 137, 48, 1)';
      }
    }};
    box-shadow: 0 0 10px rgba(187, 137, 48, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LocalesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const LocaleCard = styled.div`
  background: rgba(58, 38, 6, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(187, 137, 48, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(187, 137, 48, 0.3);
    border-color: #bb8930;
  }
`;

const LocaleImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LocaleName = styled.h3`
  font-size: 1.5rem;
  font-family: "Cinzel", serif;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const LocaleTypeSpan = styled.span`
  background: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
  margin-bottom: 1rem;
  display: inline-block;
`;

const LocaleDescription = styled.p`
  color: #e6e6e6;
  opacity: 0.8;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(58, 38, 6, 0.95);
  border: 1px solid rgba(187, 137, 48, 0.5);
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: "Cinzel", serif;
  color: #bb8930;
  font-size: 1rem;
`;

const Input = styled.input`
  background: rgba(58, 38, 6, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.5);
  color: #e6e6e6;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: "EB Garamond", serif;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
    box-shadow: 0 0 5px rgba(187, 137, 48, 0.5);
  }
`;

const TextArea = styled.textarea`
  background: rgba(58, 38, 6, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.5);
  color: #e6e6e6;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: "EB Garamond", serif;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
    box-shadow: 0 0 5px rgba(187, 137, 48, 0.5);
  }
`;

const Select = styled.select`
  background: rgba(58, 38, 6, 0.8);
  border: 1px solid rgba(187, 137, 48, 0.5);
  color: #e6e6e6;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: "EB Garamond", serif;
  
  &:focus {
    outline: none;
    border-color: #bb8930;
    box-shadow: 0 0 5px rgba(187, 137, 48, 0.5);
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(187, 137, 48, 0.3);
  border-radius: 50%;
  border-top-color: #bb8930;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AdminLocalesPage: React.FC = () => {
  const [locales, setLocales] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLocale, setEditingLocale] = useState<Locale | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    type: LocaleType.CITY,
    isRealWorld: false,
    prompt: ''
  });

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    try {
      const response = await fetch('/api/locales');
      if (response.ok) {
        const data = await response.json();
        setLocales(data);
      }
    } catch (error) {
      console.error('Error fetching locales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/locales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchLocales();
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          type: LocaleType.CITY,
          isRealWorld: false,
          prompt: ''
        });
      }
    } catch (error) {
      console.error('Error creating locale:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateLocale = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    
    try {
      const response = await fetch('/api/locales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          prompt: formData.prompt,
          localeType: formData.type,
          isRealWorld: formData.isRealWorld
        })
      });

      if (response.ok) {
        await fetchLocales();
        setShowGenerateModal(false);
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          type: LocaleType.CITY,
          isRealWorld: false,
          prompt: ''
        });
      }
    } catch (error) {
      console.error('Error generating locale:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleEditLocale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocale) return;
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/locales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLocale.id,
          ...formData
        })
      });

      if (response.ok) {
        await fetchLocales();
        setShowEditModal(false);
        setEditingLocale(null);
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          type: LocaleType.CITY,
          isRealWorld: false,
          prompt: ''
        });
      }
    } catch (error) {
      console.error('Error updating locale:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLocale = async (id: string) => {
    if (!confirm('Are you sure you want to delete this locale?')) return;
    
    try {
      const response = await fetch(`/api/locales?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchLocales();
      }
    } catch (error) {
      console.error('Error deleting locale:', error);
    }
  };

  const openEditModal = (locale: Locale) => {
    setEditingLocale(locale);
    setFormData({
      name: locale.name,
      description: locale.description,
      imageUrl: locale.imageUrl || '',
      type: locale.type,
      isRealWorld: locale.isRealWorld || false,
      prompt: ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <Title>Loading locales...</Title>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - Manage Locales</title>
        <meta name="description" content="Manage locales and generate new ones" />
      </Head>
      
      <PageWrapper>
        <Container>
          <Title>
            <MagicSpan>Manage Locales</MagicSpan>
          </Title>
          
          <ActionButtons>
            <Button onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Create Locale
            </Button>
            <Button onClick={() => setShowGenerateModal(true)}>
              <FaMagic /> Generate Locale
            </Button>
          </ActionButtons>
          
          <LocalesGrid>
            {locales.map((locale) => (
              <LocaleCard key={locale.id}>
                {locale.imageUrl && (
                  <LocaleImage src={locale.imageUrl} alt={locale.name} />
                )}
                <LocaleName>{locale.name}</LocaleName>
                <LocaleTypeSpan>{locale.type}</LocaleTypeSpan>
                <LocaleDescription>{locale.description}</LocaleDescription>
                <CardActions>
                  <Button variant="secondary" onClick={() => openEditModal(locale)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteLocale(locale.id)}>
                    <FaTrash />
                  </Button>
                </CardActions>
              </LocaleCard>
            ))}
          </LocalesGrid>
        </Container>

        {/* Create Modal */}
        <Modal isOpen={showCreateModal}>
          <ModalContent>
            <h2>Create New Locale</h2>
            <Form onSubmit={handleCreateLocale}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LocaleType })}
                >
                  {Object.values(LocaleType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Image URL</Label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isRealWorld}
                    onChange={(e) => setFormData({ ...formData, isRealWorld: e.target.checked })}
                  />
                  Real World Location
                </Label>
              </FormGroup>
              <ActionButtons>
                <Button type="submit" disabled={saving}>
                  {saving ? <LoadingSpinner /> : <FaSave />} Save
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                  <FaTimes /> Cancel
                </Button>
              </ActionButtons>
            </Form>
          </ModalContent>
        </Modal>

        {/* Generate Modal */}
        <Modal isOpen={showGenerateModal}>
          <ModalContent>
            <h2>Generate Locale with AI</h2>
            <Form onSubmit={handleGenerateLocale}>
              <FormGroup>
                <Label>Prompt</Label>
                <TextArea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Describe the locale you want to generate..."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LocaleType })}
                >
                  {Object.values(LocaleType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isRealWorld}
                    onChange={(e) => setFormData({ ...formData, isRealWorld: e.target.checked })}
                  />
                  Real World Location
                </Label>
              </FormGroup>
              <ActionButtons>
                <Button type="submit" disabled={generating}>
                  {generating ? <LoadingSpinner /> : <FaMagic />} Generate
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowGenerateModal(false)}>
                  <FaTimes /> Cancel
                </Button>
              </ActionButtons>
            </Form>
          </ModalContent>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={showEditModal}>
          <ModalContent>
            <h2>Edit Locale</h2>
            <Form onSubmit={handleEditLocale}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LocaleType })}
                >
                  {Object.values(LocaleType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Image URL</Label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isRealWorld}
                    onChange={(e) => setFormData({ ...formData, isRealWorld: e.target.checked })}
                  />
                  Real World Location
                </Label>
              </FormGroup>
              <ActionButtons>
                <Button type="submit" disabled={saving}>
                  {saving ? <LoadingSpinner /> : <FaSave />} Save
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                  <FaTimes /> Cancel
                </Button>
              </ActionButtons>
            </Form>
          </ModalContent>
        </Modal>

        <BottomNavigationBar />
      </PageWrapper>
    </>
  );
};

export default AdminLocalesPage; 