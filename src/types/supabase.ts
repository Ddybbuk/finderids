
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          category: string
          location: string
          status: "in-stock" | "low-stock" | "out-of-stock"
          quantity: number
          last_updated: string
          specifications: Json
        }
        Insert: {
          id: string
          name: string
          category: string
          location: string
          status: "in-stock" | "low-stock" | "out-of-stock"
          quantity: number
          last_updated?: string
          specifications: Json
        }
        Update: {
          id?: string
          name?: string
          category?: string
          location?: string
          status?: "in-stock" | "low-stock" | "out-of-stock"
          quantity?: number
          last_updated?: string
          specifications?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
