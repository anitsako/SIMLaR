export type ParsedUA = {
  browser: string | null;
  os: string | null;
  device: 'mobile' | 'tablet' | 'desktop';
};

export function parseUserAgent(ua: string): ParsedUA {
  let browser: string | null = null;
  let os: string | null = null;
  let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  // Device (mobile before tablet to avoid false positives)
  if (/Mobile|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) {
    device = 'mobile';
  } else if (/iPad|Android|Tablet/i.test(ua)) {
    device = 'tablet';
  }

  // OS
  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser (Edge and Opera before Chrome to avoid false positives)
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua)) browser = 'Safari';
  else if (/MSIE|Trident/i.test(ua)) browser = 'IE';

  return { browser, os, device };
}
