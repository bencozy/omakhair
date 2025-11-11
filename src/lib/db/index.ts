/**
 * Database Service Export
 * 
 * This is the single point of import for all database operations.
 * To switch database implementations:
 * 1. Create/update the implementation file (supabase.ts, mongodb.ts, etc.)
 * 2. Update the import below to point to your implementation
 * 3. That's it! Your entire app will now use the new database.
 * 
 * Current implementation: LocalStorage (for development/demo)
 * 
 * Available implementations:
 * - localStorage (current) - For development only
 * - supabase.example.ts - Copy to supabase.ts and configure
 * - mongodb.example.ts - Copy to mongodb.ts and configure
 * - prisma.example.ts - Copy to prisma.ts and configure
 */

// CHANGE THIS LINE to switch database implementations
export { db } from './localStorage';

// Examples of how to switch:
// export { db } from './supabase';
// export { db } from './mongodb';
// export { db } from './prisma';

// Export types
export type { DatabaseService } from './interface';

