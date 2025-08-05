// Authentication utilities for magic link system
export interface User {
  id: string;
  email: string;
  domain: string;
  isLabfoxUser: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Domain validation
export const isWorkEmail = (email: string): boolean => {
  const workDomains = [
    'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 
    'icloud.com', 'aol.com', 'protonmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !workDomains.includes(domain);
};

export const isLabfoxEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith('@labfox.studio');
};

export const getDomainFromEmail = (email: string): string => {
  return email.split('@')[1]?.toLowerCase() || '';
};

// Magic link utilities
export const generateMagicToken = (): string => {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
};

export const createMagicLink = (token: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/verify?token=${token}`;
};

// Session management
const SESSION_KEY = 'kaya_auth_session';
const TOKEN_KEY = 'kaya_magic_token';

export const saveSession = (user: User): void => {
  const session = {
    user,
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): { user: User; isValid: boolean } | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    const isValid = Date.now() < session.expiresAt;
    
    return {
      user: session.user,
      isValid
    };
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

// Magic token storage (temporary, 15 minutes)
export const saveMagicToken = (email: string, token: string): void => {
  const tokenData = {
    email,
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
};

export const getMagicToken = (token: string): { email: string; isValid: boolean } | null => {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return null;

    const data = JSON.parse(tokenData);
    const isValid = data.token === token && Date.now() < data.expiresAt;
    
    return {
      email: data.email,
      isValid
    };
  } catch {
    return null;
  }
};

// Rate limiting for email sending
const RATE_LIMIT_KEY = 'kaya_email_rate_limit';
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_EMAILS_PER_WINDOW = 3;

export const checkRateLimit = (email: string): { allowed: boolean; resetTime?: number } => {
  try {
    const rateLimitData = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!rateLimitData) {
      return { allowed: true };
    }

    const data = JSON.parse(rateLimitData);
    const userLimit = data[email];
    
    if (!userLimit) {
      return { allowed: true };
    }

    // Reset if window has passed
    if (now > userLimit.resetTime) {
      return { allowed: true };
    }

    // Check if under limit
    if (userLimit.count < MAX_EMAILS_PER_WINDOW) {
      return { allowed: true };
    }

    return { 
      allowed: false, 
      resetTime: userLimit.resetTime 
    };
  } catch {
    return { allowed: true };
  }
};

export const updateRateLimit = (email: string): void => {
  try {
    const rateLimitData = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    const resetTime = now + RATE_LIMIT_WINDOW;
    
    let data = rateLimitData ? JSON.parse(rateLimitData) : {};
    
    if (!data[email] || now > data[email].resetTime) {
      data[email] = { count: 1, resetTime };
    } else {
      data[email].count += 1;
    }
    
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to update rate limit:', error);
  }
};

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (!isWorkEmail(email)) {
    return { isValid: false, error: 'Please use a work email address' };
  }
  
  return { isValid: true };
};