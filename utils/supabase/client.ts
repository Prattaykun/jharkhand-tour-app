
// // Define a type for the cookiesToSet parameter
// interface CookieToSet {
//   name: string;
//   value: string;
//   options?: Record<string, any>;
// }
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
