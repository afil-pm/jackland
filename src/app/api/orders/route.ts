import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Secure global database persistence bucket
const KV_URL = 'https://kvdb.io/A9x7J2L5qN1t4w8zB3m6cR0/orders';

// Helper to read orders globally
async function getGlobalOrders() {
  try {
    const res = await fetch(KV_URL, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.error('Failed to fetch from global cloud store, falling back to local file:', e);
  }

  // Fallback to local file for development/offline
  try {
    const filePath = path.join(process.cwd(), 'orders.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.error('Failed to read local orders file:', e);
  }

  return [];
}

// Helper to save orders globally
async function saveGlobalOrders(orders: any[]) {
  // Save to global KV store for Vercel
  try {
    const res = await fetch(KV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders),
    });
    if (res.ok) {
      console.log('Saved orders successfully to global cloud store');
    }
  } catch (e) {
    console.error('Failed to save to global cloud store:', e);
  }

  // Also write to local file for local development persistence
  try {
    const filePath = path.join(process.cwd(), 'orders.json');
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save local orders file:', e);
  }
}

export async function GET() {
  const orders = await getGlobalOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const newOrder = await req.json();
    const orders = await getGlobalOrders();
    
    // Check if order already exists to avoid duplicates
    const exists = orders.some((o: any) => o.id === newOrder.id);
    if (!exists) {
      orders.unshift(newOrder);
      await saveGlobalOrders(orders);
    }
    
    return NextResponse.json({ success: true, order: newOrder });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status, additionalUpdates } = await req.json();
    const orders = await getGlobalOrders();
    
    const updatedOrders = orders.map((o: any) => 
      o.id === id ? { ...o, status, ...additionalUpdates } : o
    );
    
    await saveGlobalOrders(updatedOrders);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
