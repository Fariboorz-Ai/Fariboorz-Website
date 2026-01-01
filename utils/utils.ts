import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const logoCache = new Map<string, string | null>();

export async function getCryptoLogo(symbol: string): Promise<string | null> {
  const key = symbol.toLowerCase();


  if (logoCache.has(key)) {
    return logoCache.get(key)!;
  }

  try {
    const lower = key.replace(/[-_]/g, '').replace(/usdt$/i, '');

  
    if (lower === 'btc') {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin', {
        next: { revalidate: 3600 } 
      });
      if (res.ok) {
        const data = await res.json();
        const logo = data.image.large || data.image.small || null;
        logoCache.set(key, logo); 
        return logo;
      }
      logoCache.set(key, null);
      return null;
    }

    const list = await fetch('https://api.coingecko.com/api/v3/coins/list', {
      next: { revalidate: 3600 }
    }).then(r => r.ok ? r.json() : []);

    const coin = list
      .filter((c: any) => c.symbol.toLowerCase() === lower)
      .sort((a: any, b: any) => (a.market_cap_rank ?? Infinity) - (b.market_cap_rank ?? Infinity))[0];

    if (!coin) {
      logoCache.set(key, null);
      return null;
    }

    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      logoCache.set(key, null);
      return null;
    }

    const data = await res.json();
    const logo = data.image.large || data.image.small || null;
    logoCache.set(key, logo);
    return logo;
  } catch {
    logoCache.set(key, null);
    return null;
  }
}
