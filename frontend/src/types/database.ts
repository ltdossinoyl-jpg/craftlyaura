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
            profiles: {
                Row: {
                    id: string
                    username: string
                    avatar: string | null
                    role: string
                }
                Insert: { id?: string; username: string; avatar?: string | null; role?: string }
                Update: { id?: string; username?: string; avatar?: string | null; role?: string }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    description: string
                    price: number
                    images: string[]
                    stock: number
                    category_id: string | null
                    slug: string
                }
                Insert: { id?: string; name: string; description: string; price: number; images?: string[]; stock?: number; category_id?: string | null; slug: string }
                Update: { id?: string; name?: string; description?: string; price?: number; images?: string[]; stock?: number; category_id?: string | null; slug?: string }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    status: string
                    total_amount: number
                    stripe_session_id: string | null
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    quantity: number
                }
            }
        }
    }
}
