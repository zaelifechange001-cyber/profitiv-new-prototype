export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          message: string
          notification_type: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          message: string
          notification_type: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      community_pools: {
        Row: {
          created_at: string | null
          current_amount: number | null
          current_participants: number | null
          description: string | null
          end_date: string | null
          goal_amount: number
          id: string
          max_participants: number | null
          min_investment: number | null
          pool_name: string
          pool_type: string
          reward_distribution: Json | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          goal_amount?: number
          id?: string
          max_participants?: number | null
          min_investment?: number | null
          pool_name: string
          pool_type: string
          reward_distribution?: Json | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          goal_amount?: number
          id?: string
          max_participants?: number | null
          min_investment?: number | null
          pool_name?: string
          pool_type?: string
          reward_distribution?: Json | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          content: string | null
          content_type: string | null
          content_url: string | null
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          reward_amount: number | null
          reward_type: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          reward_amount?: number | null
          reward_type?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          reward_amount?: number | null
          reward_type?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      investment_videos: {
        Row: {
          created_at: string | null
          current_views: number | null
          description: string | null
          goal_views: number
          id: string
          investment_amount: number
          reward_per_view: number | null
          reward_type: string | null
          status: string
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          current_views?: number | null
          description?: string | null
          goal_views?: number
          id?: string
          investment_amount?: number
          reward_per_view?: number | null
          reward_type?: string | null
          status?: string
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          current_views?: number | null
          description?: string | null
          goal_views?: number
          id?: string
          investment_amount?: number
          reward_per_view?: number | null
          reward_type?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: []
      }
      payout_methods: {
        Row: {
          account_details: Json | null
          account_identifier: string
          created_at: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          method_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_details?: Json | null
          account_identifier: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          method_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_details?: Json | null
          account_identifier?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          method_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pool_participants: {
        Row: {
          id: string
          investment_amount: number
          joined_at: string | null
          pool_id: string
          user_id: string
        }
        Insert: {
          id?: string
          investment_amount: number
          joined_at?: string | null
          pool_id: string
          user_id: string
        }
        Update: {
          id?: string
          investment_amount?: number
          joined_at?: string | null
          pool_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_participants_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "community_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auto_payout_enabled: boolean | null
          auto_payout_threshold: number | null
          available_balance: number | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          tiv_balance: number | null
          tiv_to_usd_rate: number | null
          total_earned: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_payout_enabled?: boolean | null
          auto_payout_threshold?: number | null
          available_balance?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          tiv_balance?: number | null
          tiv_to_usd_rate?: number | null
          total_earned?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_payout_enabled?: boolean | null
          auto_payout_threshold?: number | null
          available_balance?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          tiv_balance?: number | null
          tiv_to_usd_rate?: number | null
          total_earned?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: number
          created_at: string | null
          id: string
          options: Json
          order_index: number | null
          points: number | null
          question: string
          quiz_id: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          id?: string
          options?: Json
          order_index?: number | null
          points?: number | null
          question: string
          quiz_id: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          id?: string
          options?: Json
          order_index?: number | null
          points?: number | null
          question?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          passing_score: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          passing_score?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          passing_score?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      spin_history: {
        Row: {
          created_at: string | null
          id: string
          reward_amount: number
          reward_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reward_amount: number
          reward_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reward_amount?: number
          reward_type?: string
          user_id?: string
        }
        Relationships: []
      }
      spin_rewards: {
        Row: {
          active: boolean | null
          color: string
          created_at: string | null
          id: string
          label: string
          probability: number
          reward_amount: number
          reward_type: string
        }
        Insert: {
          active?: boolean | null
          color?: string
          created_at?: string | null
          id?: string
          label: string
          probability: number
          reward_amount: number
          reward_type: string
        }
        Update: {
          active?: boolean | null
          color?: string
          created_at?: string | null
          id?: string
          label?: string
          probability?: number
          reward_amount?: number
          reward_type?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          features: Json | null
          id: string
          name: string
          price: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          features?: Json | null
          id?: string
          name: string
          price: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      tiv_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tiv_transactions: {
        Row: {
          amount: number
          buyer_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          listing_price: number | null
          marketplace_fee: number | null
          rate: number
          seller_id: string
          status: string
          total_price: number
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_price?: number | null
          marketplace_fee?: number | null
          rate: number
          seller_id: string
          status?: string
          total_price: number
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_price?: number | null
          marketplace_fee?: number | null
          rate?: number
          seller_id?: string
          status?: string
          total_price?: number
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          amount: number | null
          created_at: string | null
          description: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          amount?: number | null
          created_at?: string | null
          description: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          amount?: number | null
          created_at?: string | null
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_course_completions: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          passed: boolean | null
          quiz_id: string | null
          reward_claimed: boolean | null
          score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          passed?: boolean | null
          quiz_id?: string | null
          reward_claimed?: boolean | null
          score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          passed?: boolean | null
          quiz_id?: string | null
          reward_claimed?: boolean | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_completions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_completions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          plan_id: string | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          completed: boolean | null
          id: string
          reward_earned: number | null
          user_id: string
          video_id: string
          viewed_at: string | null
          watch_duration: number | null
        }
        Insert: {
          completed?: boolean | null
          id?: string
          reward_earned?: number | null
          user_id: string
          video_id: string
          viewed_at?: string | null
          watch_duration?: number | null
        }
        Update: {
          completed?: boolean | null
          id?: string
          reward_earned?: number | null
          user_id?: string
          video_id?: string
          viewed_at?: string | null
          watch_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "investment_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          amount: number
          auto_processed: boolean | null
          completed_at: string | null
          created_at: string | null
          fee: number
          id: string
          method: string
          net_amount: number
          payout_method_id: string | null
          processing_error: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          auto_processed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          fee?: number
          id?: string
          method: string
          net_amount: number
          payout_method_id?: string | null
          processing_error?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          auto_processed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          fee?: number
          id?: string
          method?: string
          net_amount?: number
          payout_method_id?: string | null
          processing_error?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_payout_method_id_fkey"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_adjust_balance: {
        Args: {
          _amount: number
          _description: string
          _operation: string
          _target_user_id: string
        }
        Returns: Json
      }
      award_course_completion: {
        Args: {
          _course_id: string
          _passed: boolean
          _score: number
          _user_id: string
        }
        Returns: Json
      }
      buy_tiv_from_marketplace: {
        Args: { _listing_id: string }
        Returns: Json
      }
      convert_tiv_to_usd: {
        Args: { _tiv_amount: number; _user_id: string }
        Returns: Json
      }
      create_withdrawal_request: {
        Args: { _amount: number; _method: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_tiv_on_marketplace: {
        Args: { _amount: number; _rate: number }
        Returns: Json
      }
      process_auto_payout: {
        Args: { _user_id: string }
        Returns: Json
      }
      spin_wheel: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      submit_quiz_answers: {
        Args: { _answers: Json; _course_id: string; _quiz_id: string }
        Returns: Json
      }
      user_can_see_quiz_answer: {
        Args: { _question_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
