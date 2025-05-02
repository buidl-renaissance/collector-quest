import { useState, useEffect } from 'react';
import { getHandleByAddress } from '@/lib/getHandle';
import { getWallet } from '@/lib/wallet';

/**
 * Hook to load a user's handle and store it locally
 * @returns Object containing handle, loading state, and error
 */
export const useHandle = () => {
  const [handle, setHandle] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandle = async () => {
      try {
        // // Check for cached handle in localStorage
        // const cachedHandle = localStorage.getItem('userHandle');    
        // const cachedImage = localStorage.getItem('userHandleImage');
        // if (cachedHandle) {
        //   setHandle(cachedHandle);
        //   setImage(cachedImage);
        //   setLoading(false);
        //   return;
        // }

        // Get wallet
        const wallet = getWallet();
        if (!wallet) {
          setError('Wallet not connected');
          setLoading(false);
          return;
        }

        // Get address from wallet
        const address = wallet.getPublicKey().toSuiAddress();
        
        // Fetch handle from blockchain
        const { handle: fetchedHandle, image: fetchedImage } = await getHandleByAddress(address);
        
        if (fetchedHandle) {
          // Store in localStorage for future use
        //   localStorage.setItem('userHandle', fetchedHandle);
        //   localStorage.setItem('userHandleImage', fetchedImage);
          setHandle(fetchedHandle);
          setImage(fetchedImage);
        }
      } catch (err) {
        console.error('Error fetching handle:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch handle');
      } finally {
        setLoading(false);
      }
    };

    fetchHandle();
  }, []);

  return { handle, image, loading, error };
};
