import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "my-app",
  // Disable async hooks in client-side code
  asyncHooks: false
});

