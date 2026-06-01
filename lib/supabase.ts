import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isUrlValid = (url: string) => {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      !url.includes('your_supabase_project_url') &&
      !url.includes('xyzcompanyname')
    );
  } catch {
    return false;
  }
};

const isSupabaseConfigured =
  isUrlValid(supabaseUrl) &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseAnonKey !== 'placeholder' &&
  supabaseServiceKey &&
  supabaseServiceKey !== 'your_supabase_service_role_key' &&
  supabaseServiceKey !== 'placeholder';

// Define local directories
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_ORDERS_FILE = path.join(LOCAL_DATA_DIR, 'orders.json');
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureDirectories() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_ORDERS_FILE)) {
    fs.writeFileSync(LOCAL_ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
  }
}

class MockSupabaseClient {
  from(table: string) {
    ensureDirectories();
    return {
      select: (fields: string = '*') => {
        return {
          order: (field: string, { ascending = true } = {}) => {
            try {
              const fileContent = fs.readFileSync(LOCAL_ORDERS_FILE, 'utf-8');
              let orders = JSON.parse(fileContent);
              orders.sort((a: any, b: any) => {
                const valA = a[field];
                const valB = b[field];
                if (valA < valB) return ascending ? -1 : 1;
                if (valA > valB) return ascending ? 1 : -1;
                return 0;
              });
              return { data: orders, error: null };
            } catch (err: any) {
              return { data: null, error: { message: err.message } };
            }
          }
        };
      },
      insert: (rows: any[]) => {
        try {
          const fileContent = fs.readFileSync(LOCAL_ORDERS_FILE, 'utf-8');
          const orders = JSON.parse(fileContent);
          
          const newRows = rows.map(row => ({
            id: row.id || Math.random().toString(36).substring(2, 15),
            ...row,
            created_at: row.created_at || new Date().toISOString()
          }));
          
          orders.push(...newRows);
          fs.writeFileSync(LOCAL_ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
          return { data: newRows, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message } };
        }
      },
      update: (fields: any) => {
        return {
          eq: (field: string, value: any) => {
            try {
              const fileContent = fs.readFileSync(LOCAL_ORDERS_FILE, 'utf-8');
              const orders = JSON.parse(fileContent);
              
              let updated = false;
              const newOrders = orders.map((order: any) => {
                if (order[field] === value) {
                  updated = true;
                  return { ...order, ...fields };
                }
                return order;
              });
              
              if (updated) {
                fs.writeFileSync(LOCAL_ORDERS_FILE, JSON.stringify(newOrders, null, 2), 'utf-8');
              }
              return { error: null };
            } catch (err: any) {
              return { error: { message: err.message } };
            }
          }
        };
      }
    };
  }

  storage = {
    from: (bucket: string) => {
      ensureDirectories();
      return {
        upload: async (fileName: string, fileBuffer: ArrayBuffer, options: any) => {
          try {
            const buffer = Buffer.from(fileBuffer);
            const filePath = path.join(LOCAL_UPLOADS_DIR, fileName);
            await fs.promises.writeFile(filePath, buffer);
            return { data: { path: fileName }, error: null };
          } catch (err: any) {
            return { data: null, error: { message: err.message } };
          }
        },
        getPublicUrl: (fileName: string) => {
          return {
            data: {
              publicUrl: `/uploads/${fileName}`
            }
          };
        }
      };
    }
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as any);

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey)
  : (new MockSupabaseClient() as any);
