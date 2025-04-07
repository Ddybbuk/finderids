
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
      },
      cell: {
        Row: {
          id: string
          "defect type"?: string | null
          date?: string | null
          value?: number | null
          row?: number | null
          "row number"?: number | null
          [key: string]: any
        }
        Insert: {
          id: string
          "defect type"?: string | null
          date?: string | null
          value?: number | null
          row?: number | null
          "row number"?: number | null
          [key: string]: any
        }
        Update: {
          id?: string
          "defect type"?: string | null
          date?: string | null
          value?: number | null
          row?: number | null
          "row number"?: number | null
          [key: string]: any
        }
      },
      pallet: {
        Row: {
          id: number
          "Dzien pracy": string | null
          FIFO: number | null
          PalletID: string | null
          RFID: string | null
        }
        Insert: {
          id: number
          "Dzien pracy"?: string | null
          FIFO?: number | null
          PalletID?: string | null
          RFID?: string | null
        }
        Update: {
          id?: number
          "Dzien pracy"?: string | null
          FIFO?: number | null
          PalletID?: string | null
          RFID?: string | null
        }
        Relationships: []
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
