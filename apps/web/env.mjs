import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        CREEM_API_KEY: z.string().min(1),
        CREEM_WEBHOOK_SECRET: z.string().min(1),
        NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
        SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
        NODE_ENV: z.enum(["development", "production", "test"]),
    },
    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    },
    runtimeEnv: {
        CREEM_API_KEY: process.env.CREEM_API_KEY,
        CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NODE_ENV: process.env.NODE_ENV,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});