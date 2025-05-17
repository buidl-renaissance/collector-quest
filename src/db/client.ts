import knex, { Knex } from 'knex';
import { Rsvp, Story } from '../lib/interfaces';

// Create a singleton instance of Knex
let db: Knex;

if (process.env.NODE_ENV === 'production') {
  db = knex({
    client: process.env.DB_CLIENT,
    connection: process.env.DB_CONNECTION_STRING,
    pool: { min: 2, max: 10 }
  });
} else {
  // In development, use a global variable to prevent multiple instances during hot-reloading
  if (!(global as any).db) {
    (global as any).db = knex({
      client: 'sqlite3',
      connection: {
        filename: './dev.sqlite3'
      },
      useNullAsDefault: true
    });
  }
  db = (global as any).db;
}

/**
 * Save an RSVP with the selected time slot to the database
 */
export async function saveRsvp(data: Rsvp) {
  try {
    const result = await db('rsvps').insert({
      name: data.name,
      email: data.email,
      guests: data.guests,
      message: data.message || '',
      time_slot_id: data.timeSlot?.id,
      time_slot_datetime: data.timeSlot?.datetime,
      confirmed: false,
      created_at: new Date()
    }).returning('*');
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return { success: false, error };
  }
}

/**
 * Get all available time slots
 */
export async function getTimeSlots() {
  try {
    const slots = await db('time_slots')
      .select('*')
      .orderBy('datetime', 'asc');
    
    return { 
      success: true, 
      data: slots.map(slot => ({
        id: slot.id,
        date: slot.date,
        datetime: slot.datetime,
        startTime: slot.start_time,
        endTime: slot.end_time
      }))
    };
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return { success: false, error };
  }
}

/**
 * Get a story by its ID
 */
export async function getStoryById(id: string) {
  try {
    const story = await db('stories')
      .select('*')
      .where('id', id)
      .first();
    
    return { success: true, data: story };
  } catch (error) {
    console.error('Error fetching story:', error);
    return { success: false, error };
  }
}

/**
 * Get a story by its slug
 */
export async function getStoryBySlug(slug: string) {
  try {
    const story = await db('stories')
      .select('*')
      .where('slug', slug)
      .first();
    
    return { success: true, data: story };
  } catch (error) {
    console.error('Error fetching story:', error);
    return { success: false, error };
  }
}

/**
 * Create a new story
 */
export async function createStory(data: Story) {
  try {
    const result = await db('stories').insert({
      id: data.id,
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      script: data.script,
      realmId: data.realmId,
      createdAt: data.createdAt
    }).returning('*');
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false, error };
  }
}

/**
 * Get all stories
 */
export async function getAllStories() {
  try {
    const stories = await db('stories')
      .select('*')
      .orderBy('createdAt', 'desc');
    
    return { success: true, data: stories };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { success: false, error };
  }
}

/**
 * Mark a story as visited by a user
 */
export async function markStoryAsVisited(storyId: string, userId: string) {
  try {
    await db('visited_stories').insert({
      storyId,
      userId,
    }).onConflict(['storyId', 'userId']).ignore();
    
    return { success: true };
  } catch (error) {
    console.error('Error marking story as visited:', error);
    return { success: false, error };
  }
}

/**
 * Check if a story has been visited by a user
 */
export async function isStoryVisited(storyId: string, userId: string) {
  try {
    const visited = await db('visited_stories')
      .where({ storyId, userId })
      .first();
    
    return { success: true, visited: !!visited };
  } catch (error) {
    console.error('Error checking if story is visited:', error);
    return { success: false, error };
  }
}

/**
 * Get all visited stories for a user
 */
export async function getVisitedStories(userId: string) {
  try {
    const visitedStories = await db('visited_stories')
      .where({ userId })
      .select('storyId');
    
    return { success: true, data: visitedStories.map(vs => vs.storyId) };
  } catch (error) {
    console.error('Error fetching visited stories:', error);
    return { success: false, error };
  }
}

export default db;
