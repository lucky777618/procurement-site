/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any;
    user: { id: string; email?: string } | null;
    runtime?: { env?: Record<string, string | undefined> };
  }
}
