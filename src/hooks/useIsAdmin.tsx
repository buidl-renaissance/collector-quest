import { useState, useEffect } from 'react';

const ADMIN_MODE_KEY = 'admin_mode_enabled';

/**
 * Hook to get and set admin status using localStorage
 * @returns Object with isAdmin status and functions to enable/disable admin mode
 */
const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Load admin mode status from localStorage on component mount
    if (typeof window !== 'undefined') {
      const storedAdminMode = localStorage.getItem(ADMIN_MODE_KEY);
      setIsAdmin(storedAdminMode === 'true');
    }
  }, []);

  const enableAdminMode = () => {
    setIsAdmin(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_MODE_KEY, 'true');
    }
  };

  const disableAdminMode = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_MODE_KEY, 'false');
    }
  };

  const toggleAdminMode = () => {
    const newAdminMode = !isAdmin;
    setIsAdmin(newAdminMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_MODE_KEY, newAdminMode.toString());
    }
  };

  return {
    isAdmin,
    enableAdminMode,
    disableAdminMode,
    toggleAdminMode
  };
};

export default useIsAdmin;
