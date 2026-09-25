import { normalizeAndValidateUrl } from '../../utils/urlUtils';

export interface SecuritySignal {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'neutral';
  status: 'verified' | 'detected' | 'unavailable';
  description: string;
  weight: number;
}

const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'verification', 'secure', 'account', 'update', 'password', 'bank', 'wallet', 'payment', 'signin', 'confirm', 'urgent', 'free', 'reward', 'claim', 'security'];

export const analyzeUrlSignals = (urlString: string) => {
  const { url, normalized, error } = normalizeAndValidateUrl(urlString);
  if (error) {
    throw new Error(error);
  }

  const signals: SecuritySignal[] = [];

  // A. HTTPS
  if (url.protocol === 'https:') {
    signals.push({ id: 'https', name: 'HTTPS', type: 'positive', status: 'verified', description: 'Connection uses secure HTTPS protocol.', weight: 5 });
  } else {
    signals.push({ id: 'http', name: 'HTTP Only', type: 'negative', status: 'detected', description: 'Connection uses unencrypted HTTP protocol.', weight: -15 });
  }

  // B. IP ADDRESS HOST
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(url.hostname)) {
    signals.push({ id: 'ip_host', name: 'IP Address Hostname', type: 'negative', status: 'detected', description: 'The hostname is an IP address instead of a domain name, common in phishing.', weight: -20 });
  }

  // C. URL LENGTH
  if (normalized.length > 75) {
    signals.push({ id: 'long_url', name: 'Long URL', type: 'negative', status: 'detected', description: 'The URL is unusually long, which can be used to hide suspicious parts.', weight: -5 });
  }

  // D. SUBDOMAIN COUNT
  const parts = url.hostname.split('.');
  // e.g. example.com has 2 parts (0 subdomains). www.example.com has 3 (1 subdomain).
  const isIP = ipv4Regex.test(url.hostname);
  if (!isIP && parts.length > 3) {
    signals.push({ id: 'deep_subdomains', name: 'Multiple Subdomains', type: 'negative', status: 'detected', description: 'The domain has an unusually deep subdomain structure.', weight: -10 });
  }

  // E. SUSPICIOUS CHARACTERS
  if (url.hostname.includes('@') || url.pathname.includes('@')) {
    signals.push({ id: 'at_symbol', name: 'Suspicious @ Symbol', type: 'negative', status: 'detected', description: 'URL contains an @ symbol, often used to obscure the true destination.', weight: -15 });
  }

  // G. SUSPICIOUS KEYWORDS
  let foundKeywords = 0;
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (normalized.toLowerCase().includes(kw)) {
      foundKeywords++;
    }
  }
  if (foundKeywords > 0) {
    signals.push({ id: 'suspicious_keywords', name: 'Suspicious Keywords', type: 'negative', status: 'detected', description: `URL contains ${foundKeywords} commonly abused keyword(s) (e.g., login, verify).`, weight: -5 * Math.min(foundKeywords, 3) });
  }

  // H. PUNYCODE / IDN
  if (url.hostname.includes('xn--')) {
    signals.push({ id: 'punycode', name: 'Punycode Domain', type: 'negative', status: 'detected', description: 'Domain uses internationalized characters (punycode), possible homograph attack.', weight: -15 });
  }

  // J. PORT
  if (url.port && url.port !== '80' && url.port !== '443') {
    signals.push({ id: 'unusual_port', name: 'Unusual Port', type: 'negative', status: 'detected', description: `URL uses non-standard port ${url.port}.`, weight: -5 });
  }

  // Threat Intel Placeholder
  signals.push({ id: 'threat_intel', name: 'Threat Intelligence', type: 'neutral', status: 'unavailable', description: 'External threat intelligence was not available or configured.', weight: 0 });

  return { url, normalized, signals };
};
