import { Inngest } from "inngest";

// Create a server-side client to send and receive events
export const inngestServer = new Inngest({ 
  id: "my-app",
  // Disable async hooks in development to prevent Node.js module issues
  asyncHooks: process.env.NODE_ENV === 'production'
}); 