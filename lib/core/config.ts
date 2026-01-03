// ============================================================================
// Configuration Management
// ============================================================================
// Centralized configuration with:
// - Environment variable validation at startup
// - Type-safe configuration access
// - Feature flags
// - Runtime configuration updates
// - Secrets management
// ============================================================================

import { z } from "zod";

/**
 * Environment validation schema
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Application
  APP_NAME: z.string().default("betaforge"),
  APP_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(["DEBUG", "INFO", "WARN", "ERROR"]).default("INFO"),

  // Supabase (optional for local dev)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Anthropic (optional)
  ANTHROPIC_API_KEY: z.string().optional(),

  // Embedding providers (optional)
  OPENAI_API_KEY: z.string().optional(),
  JINA_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),

  // Auth placeholder - configure your preferred provider
  // AUTH_SECRET: z.string().optional(),

  // Rate limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.coerce.number().default(60),
  RATE_LIMIT_BURST: z.coerce.number().default(10),

  // Feature flags
  FEATURE_AI_TESTING: z.coerce.boolean().default(true),
  FEATURE_WEBHOOKS: z.coerce.boolean().default(true),
  FEATURE_REALTIME: z.coerce.boolean().default(true),
  FEATURE_ANALYTICS: z.coerce.boolean().default(false),
});

type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validated environment configuration
 */
let validatedEnv: EnvConfig | null = null;

/**
 * Validate and parse environment variables
 */
function validateEnv(): EnvConfig {
  if (validatedEnv) {
    return validatedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `  ${e.path.join(".")}: ${e.message}`)
      .join("\n");

    console.error("❌ Invalid environment configuration:\n" + errors);

    // In production, fail fast. In dev, use defaults.
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration");
    }

    // Use defaults for development
    validatedEnv = envSchema.parse({});
    return validatedEnv;
  }

  validatedEnv = result.data;
  return validatedEnv;
}

/**
 * Application configuration object
 */
export const config = {
  get env() {
    return validateEnv();
  },

  get isDev() {
    return this.env.NODE_ENV === "development";
  },

  get isProd() {
    return this.env.NODE_ENV === "production";
  },

  get isTest() {
    return this.env.NODE_ENV === "test";
  },

  // Service availability
  get isSupabaseConfigured() {
    const env = this.env;
    return Boolean(
      env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  },

  get isAnthropicConfigured() {
    return Boolean(this.env.ANTHROPIC_API_KEY);
  },

  get isAuthConfigured() {
    // TODO: Update when auth provider is configured
    return false;
  },

  // Feature flags
  features: {
    get aiTesting() {
      return (
        validateEnv().FEATURE_AI_TESTING &&
        Boolean(validateEnv().ANTHROPIC_API_KEY)
      );
    },
    get webhooks() {
      return validateEnv().FEATURE_WEBHOOKS;
    },
    get realtime() {
      return validateEnv().FEATURE_REALTIME;
    },
    get analytics() {
      return validateEnv().FEATURE_ANALYTICS;
    },
  },

  // Rate limiting config
  rateLimit: {
    get requestsPerMinute() {
      return validateEnv().RATE_LIMIT_REQUESTS_PER_MINUTE;
    },
    get burst() {
      return validateEnv().RATE_LIMIT_BURST;
    },
  },

  // Supabase config
  supabase: {
    get url() {
      return validateEnv().NEXT_PUBLIC_SUPABASE_URL || "";
    },
    get anonKey() {
      return validateEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    },
    get serviceRoleKey() {
      return validateEnv().SUPABASE_SERVICE_ROLE_KEY;
    },
  },

  // AI config
  ai: {
    get anthropicApiKey() {
      return validateEnv().ANTHROPIC_API_KEY;
    },
    get openaiApiKey() {
      return validateEnv().OPENAI_API_KEY;
    },
    get jinaApiKey() {
      return validateEnv().JINA_API_KEY;
    },
    get ollamaBaseUrl() {
      return validateEnv().OLLAMA_BASE_URL;
    },
  },
};

/**
 * Feature flag checker with fallback behavior
 */
export function isFeatureEnabled(
  feature: keyof typeof config.features
): boolean {
  return config.features[feature];
}

/**
 * Require a specific configuration to be present
 */
export function requireConfig<T>(value: T | undefined | null, name: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Missing required configuration: ${name}`);
  }
  return value;
}

/**
 * Get config with graceful degradation
 */
export function getConfigOrDefault<T>(
  value: T | undefined,
  defaultValue: T
): T {
  return value ?? defaultValue;
}
