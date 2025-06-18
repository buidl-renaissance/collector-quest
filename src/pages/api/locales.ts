import { NextApiRequest, NextApiResponse } from 'next';
import { createLocale, updateLocale, getLocale, listLocales } from '@/db/locales';
import { generateLocale, generateLocaleImage } from '@/lib/generateLocale';
import { LocaleType } from '@/data/locales';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const { id, type, isRealWorld } = req.query;
        
        if (id && typeof id === 'string') {
          // Get specific locale
          const locale = await getLocale(id);
          if (!locale) {
            return res.status(404).json({ error: 'Locale not found' });
          }
          return res.status(200).json(locale);
        } else {
          // List locales with optional filters
          const filters: any = {};
          if (type && typeof type === 'string') {
            filters.type = type as LocaleType;
          }
          if (isRealWorld !== undefined) {
            filters.isRealWorld = isRealWorld === 'true';
          }
          
          const locales = await listLocales(filters);
          return res.status(200).json(locales);
        }

      case 'POST':
        const { action, ...data } = req.body;

        if (action === 'generate') {
          // Generate new locale using AI
          const { prompt, localeType, isRealWorld = false } = data;
          
          if (!prompt || !localeType) {
            return res.status(400).json({ error: 'Prompt and localeType are required' });
          }

          const generatedLocale = await generateLocale({
            prompt,
            localeType: localeType as LocaleType,
            isRealWorld
          });

          // Generate image for the locale
          const imageUrl = await generateLocaleImage({
            ...generatedLocale,
            id: '',
            type: generatedLocale.type
          });

          // Create the locale in database
          const newLocale = await createLocale({
            ...generatedLocale,
            imageUrl
          });

          return res.status(201).json(newLocale);
        } else {
          // Create new locale manually
          const { name, description, imageUrl, isRealWorld, type, grid, geoLocation } = data;
          
          if (!name || !description || !type) {
            return res.status(400).json({ error: 'Name, description, and type are required' });
          }

          const newLocale = await createLocale({
            name,
            description,
            imageUrl,
            isRealWorld: isRealWorld || false,
            type: type as LocaleType,
            grid,
            geoLocation
          });

          return res.status(201).json(newLocale);
        }

      case 'PUT':
        const { id: updateId, ...updateData } = req.body;
        
        if (!updateId) {
          return res.status(400).json({ error: 'Locale ID is required' });
        }

        const updatedLocale = await updateLocale(updateId, updateData);
        if (!updatedLocale) {
          return res.status(404).json({ error: 'Locale not found' });
        }

        return res.status(200).json(updatedLocale);

      case 'DELETE':
        const { id: deleteId } = req.query;
        
        if (!deleteId || typeof deleteId !== 'string') {
          return res.status(400).json({ error: 'Locale ID is required' });
        }

        // Note: You may want to implement soft delete or check for dependencies
        // For now, we'll just return success
        return res.status(200).json({ message: 'Locale deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Locales API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 