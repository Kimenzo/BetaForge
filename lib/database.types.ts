export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          agent_name: string | null;
          created_at: string | null;
          data: Json | null;
          event_type: string;
          id: string;
          message: string | null;
          session_id: string;
        };
        Insert: {
          agent_name?: string | null;
          created_at?: string | null;
          data?: Json | null;
          event_type: string;
          id?: string;
          message?: string | null;
          session_id: string;
        };
        Update: {
          agent_name?: string | null;
          created_at?: string | null;
          data?: Json | null;
          event_type?: string;
          id?: string;
          message?: string | null;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "test_sessions";
            referencedColumns: ["id"];
          }
        ];
      };
      agent_executions: {
        Row: {
          agent_id: string;
          agent_name: string;
          completed_at: string | null;
          created_at: string | null;
          environment_config: Json;
          id: string;
          interaction_log: Json | null;
          progress: number | null;
          screen_recording: string | null;
          screenshots: string[] | null;
          session_id: string;
          started_at: string | null;
          status: string;
        };
        Insert: {
          agent_id: string;
          agent_name: string;
          completed_at?: string | null;
          created_at?: string | null;
          environment_config?: Json;
          id?: string;
          interaction_log?: Json | null;
          progress?: number | null;
          screen_recording?: string | null;
          screenshots?: string[] | null;
          session_id: string;
          started_at?: string | null;
          status?: string;
        };
        Update: {
          agent_id?: string;
          agent_name?: string;
          completed_at?: string | null;
          created_at?: string | null;
          environment_config?: Json;
          id?: string;
          interaction_log?: Json | null;
          progress?: number | null;
          screen_recording?: string | null;
          screenshots?: string[] | null;
          session_id?: string;
          started_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_executions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "test_sessions";
            referencedColumns: ["id"];
          }
        ];
      };
      bug_reports: {
        Row: {
          actual_behavior: string | null;
          agent_color: string | null;
          agent_name: string | null;
          console_errors: Json | null;
          created_at: string | null;
          description: string;
          environment_info: Json;
          execution_id: string;
          expected_behavior: string | null;
          id: string;
          network_logs: Json | null;
          project_id: string;
          reproduction_steps: string[];
          screenshots: string[] | null;
          severity: string;
          status: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          actual_behavior?: string | null;
          agent_color?: string | null;
          agent_name?: string | null;
          console_errors?: Json | null;
          created_at?: string | null;
          description: string;
          environment_info?: Json;
          execution_id: string;
          expected_behavior?: string | null;
          id?: string;
          network_logs?: Json | null;
          project_id: string;
          reproduction_steps?: string[];
          screenshots?: string[] | null;
          severity: string;
          status?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          actual_behavior?: string | null;
          agent_color?: string | null;
          agent_name?: string | null;
          console_errors?: Json | null;
          created_at?: string | null;
          description?: string;
          environment_info?: Json;
          execution_id?: string;
          expected_behavior?: string | null;
          id?: string;
          network_logs?: Json | null;
          project_id?: string;
          reproduction_steps?: string[];
          screenshots?: string[] | null;
          severity?: string;
          status?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bug_reports_execution_id_fkey";
            columns: ["execution_id"];
            isOneToOne: false;
            referencedRelation: "agent_executions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bug_reports_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          access_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          platform: string[];
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          access_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          platform?: string[];
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          access_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          platform?: string[];
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      test_sessions: {
        Row: {
          bugs_found: number | null;
          completed_at: string | null;
          created_at: string | null;
          id: string;
          progress: number | null;
          project_id: string;
          started_at: string | null;
          status: string;
          trigger_metadata: Json | null;
          trigger_type: string;
        };
        Insert: {
          bugs_found?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          progress?: number | null;
          project_id: string;
          started_at?: string | null;
          status?: string;
          trigger_metadata?: Json | null;
          trigger_type?: string;
        };
        Update: {
          bugs_found?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          progress?: number | null;
          project_id?: string;
          started_at?: string | null;
          status?: string;
          trigger_metadata?: Json | null;
          trigger_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_sessions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          language: string | null;
          notifications: Json | null;
          role: string | null;
          timezone: string | null;
          updated_at: string | null;
          workspace_name: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          language?: string | null;
          notifications?: Json | null;
          role?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          workspace_name?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          language?: string | null;
          notifications?: Json | null;
          role?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          workspace_name?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          provider_payment_id: string;
          amount: number;
          currency: string;
          status: string;
          plan_id: string | null;
          metadata: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          provider_payment_id: string;
          amount: number;
          currency: string;
          status: string;
          plan_id?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          provider_payment_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          plan_id?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          status: string;
          invoice_number: string | null;
          description: string | null;
          pdf_url: string | null;
          created_at: string | null;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          status?: string;
          invoice_number?: string | null;
          description?: string | null;
          pdf_url?: string | null;
          created_at?: string | null;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          invoice_number?: string | null;
          description?: string | null;
          pdf_url?: string | null;
          created_at?: string | null;
          paid_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          provider_subscription_id: string;
          provider_customer_id: string | null;
          plan_id: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          metadata: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          provider_subscription_id: string;
          provider_customer_id?: string | null;
          plan_id: string;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          provider_subscription_id?: string;
          provider_customer_id?: string | null;
          plan_id?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          name: string;
          key_hash: string;
          key_prefix: string;
          scopes: string[];
          is_active: boolean;
          expires_at: string | null;
          last_used_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          name: string;
          key_hash: string;
          key_prefix: string;
          scopes?: string[];
          is_active?: boolean;
          expires_at?: string | null;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          name?: string;
          key_hash?: string;
          key_prefix?: string;
          scopes?: string[];
          is_active?: boolean;
          expires_at?: string | null;
          last_used_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "api_keys_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      webhook_endpoints: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          url: string;
          secret: string;
          events: string[];
          is_active: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          url: string;
          secret: string;
          events: string[];
          is_active?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          url?: string;
          secret?: string;
          events?: string[];
          is_active?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "webhook_endpoints_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      webhook_deliveries: {
        Row: {
          id: string;
          webhook_id: string;
          event_type: string;
          payload: Json;
          status: string;
          response_status: number | null;
          response_body: string | null;
          attempts: number;
          next_retry_at: string | null;
          created_at: string;
          delivered_at: string | null;
        };
        Insert: {
          id?: string;
          webhook_id: string;
          event_type: string;
          payload: Json;
          status?: string;
          response_status?: number | null;
          response_body?: string | null;
          attempts?: number;
          next_retry_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
        };
        Update: {
          id?: string;
          webhook_id?: string;
          event_type?: string;
          payload?: Json;
          status?: string;
          response_status?: number | null;
          response_body?: string | null;
          attempts?: number;
          next_retry_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey";
            columns: ["webhook_id"];
            isOneToOne: false;
            referencedRelation: "webhook_endpoints";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_project_stats: {
        Args: { project_uuid: string };
        Returns: {
          bugs_found: number;
          last_tested: string;
          sessions_count: number;
        }[];
      };
    };
    Enums: {
      agent_event_type:
        | "agent_started"
        | "agent_action"
        | "agent_screenshot"
        | "agent_bug_found"
        | "agent_completed"
        | "agent_failed"
        | "session_started"
        | "session_completed"
        | "session_failed";
      bug_severity: "critical" | "high" | "medium" | "low";
      console_error_type: "error" | "warning" | "log";
      platform_type: "web" | "mobile" | "desktop";
      project_status: "active" | "testing" | "idle" | "error";
      test_status: "queued" | "running" | "completed" | "failed";
      trigger_type: "manual" | "webhook" | "scheduled";
      payment_status: "pending" | "succeeded" | "failed" | "refunded";
      subscription_status: "active" | "cancelled" | "past_due" | "incomplete" | "trialing";
      payment_provider: "paystack" | "dodo";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Convenience type aliases
export type User = Tables<"users">;
export type Project = Tables<"projects">;
export type TestSession = Tables<"test_sessions">;
export type AgentExecution = Tables<"agent_executions">;
export type BugReport = Tables<"bug_reports">;
export type ActivityLog = Tables<"activity_logs">;
export type Payment = Tables<"payments">;
export type UserSubscription = Tables<"user_subscriptions">;

export type ProjectInsert = TablesInsert<"projects">;
export type TestSessionInsert = TablesInsert<"test_sessions">;
export type AgentExecutionInsert = TablesInsert<"agent_executions">;
export type BugReportInsert = TablesInsert<"bug_reports">;
export type ActivityLogInsert = TablesInsert<"activity_logs">;
export type PaymentInsert = TablesInsert<"payments">;
export type UserSubscriptionInsert = TablesInsert<"user_subscriptions">;
export type ApiKey = Tables<"api_keys">;
export type ApiKeyInsert = TablesInsert<"api_keys">;
export type WebhookEndpoint = Tables<"webhook_endpoints">;
export type WebhookEndpointInsert = TablesInsert<"webhook_endpoints">;
export type WebhookDelivery = Tables<"webhook_deliveries">;
export type WebhookDeliveryInsert = TablesInsert<"webhook_deliveries">;

// Enum constants for easy access
export const BugSeverity = ["critical", "high", "medium", "low"] as const;
export const ProjectStatus = ["active", "testing", "idle", "error"] as const;
export const TestStatus = ["queued", "running", "completed", "failed"] as const;
export const TriggerType = ["manual", "webhook", "scheduled"] as const;
export const PlatformType = ["web", "mobile", "desktop"] as const;
export const PaymentStatus = ["pending", "succeeded", "failed", "refunded"] as const;
export const SubscriptionStatus = ["active", "cancelled", "past_due", "incomplete", "trialing"] as const;
export const PaymentProvider = ["paystack", "dodo"] as const;
export const AgentEventType = [
  "agent_started",
  "agent_action",
  "agent_screenshot",
  "agent_bug_found",
  "agent_completed",
  "agent_failed",
  "session_started",
  "session_completed",
  "session_failed",
] as const;
