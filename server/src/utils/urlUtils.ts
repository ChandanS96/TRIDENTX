import { z } from 'zod';

export function normalizeAndValidateUrl(inputUrl: string): { url: URL; normalized: string; error?: string } {
  let urlString = inputUrl.trim();
  
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = 'http://' + urlString;
  }

  try {
    const url = new URL(urlString);
    
    // SSRF Protections
    const hostname = url.hostname;
    
    // Block local/private IPs and names
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hostname.endsWith('.local')
    ) {
      if (process.env.NODE_ENV !== 'development') { // Allow localhost in dev for testing if really needed, but better to block
        return { url, normalized: '', error: 'Local or private addresses are not permitted.' };
      }
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { url, normalized: '', error: 'Only HTTP and HTTPS protocols are supported.' };
    }

    if (urlString.length > 2048) {
      return { url, normalized: '', error: 'URL exceeds maximum length.' };
    }

    return { url, normalized: url.toString() };
  } catch (e) {
    return { url: {} as URL, normalized: '', error: 'Invalid URL format.' };
  }
}
