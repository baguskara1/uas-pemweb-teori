import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage using vi.stubGlobal (must be done before imports that use localStorage)
const localStorageStore: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] || null),
  setItem: vi.fn((key: string, value: string) => { localStorageStore[key] = value; }),
  removeItem: vi.fn((key: string) => { delete localStorageStore[key]; }),
  clear: vi.fn(() => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }),
  get length() { return Object.keys(localStorageStore).length; },
  key: vi.fn((i: number) => Object.keys(localStorageStore)[i] || null),
};

// Use vi.stubGlobal to properly mock global variables before imports
vi.stubGlobal('localStorage', localStorageMock);

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Supabase
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  })),
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
  })),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useSpring: () => 0,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const icons = [
    'Camera', 'CameraOff', 'Search', 'Filter', 'X', 'ChevronDown', 'ChevronUp',
    'ShoppingCart', 'Plus', 'Minus', 'Trash2', 'Heart', 'Star', 'MapPin',
    'Calendar', 'Clock', 'DollarSign', 'Check', 'ArrowLeft', 'ArrowRight',
    'Menu', 'Sun', 'Moon', 'User', 'LogOut', 'Settings', 'Bell', 'Mail',
    'Lock', 'Unlock', 'Eye', 'EyeOff', 'Copy', 'Download', 'Upload', 'Share',
    'Edit', 'Delete', 'Save', 'Cancel', 'Confirm', 'Alert', 'CheckCircle',
    'AlertCircle', 'Info', 'HelpCircle', 'Home', 'Package', 'Truck', 'CreditCard',
    'Banknote', 'Wallet', 'Receipt', 'Invoice', 'FileText', 'FileCheck', 'FileX',
    'Archive', 'Folder', 'FolderOpen', 'Tag', 'Tags', 'Barcode', 'QrCode', 'Scanner',
    'Package2', 'Box', 'PackageSearch', 'Ship', 'Plane', 'Train', 'Bus',
    'Car', 'Bike', 'Walk', 'MapPin', 'Navigation', 'Compass', 'Map', 'Globe',
    'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'UserCog', 'UserCircle',
    'MessageSquare', 'MessageCircle', 'Send', 'Inbox', 'Outbox', 'Archive',
    'Trash', 'Flag', 'ThumbsUp', 'ThumbsDown', 'Award', 'Trophy',
    'Medal', 'Crown', 'Gem', 'Diamond', 'Sparkles', 'Zap', 'Flame', 'Bolt', 'Cloud',
    'Sun', 'Moon', 'CloudRain', 'CloudSnow', 'CloudLightning', 'Wind', 'Droplets',
    'Waves', 'Mountain', 'Tree', 'Flower', 'Leaf', 'Seedling', 'Sprout', 'Plant',
    'ShoppingCart', 'ShoppingBag', 'CreditCard', 'Banknote', 'Coins', 'Wallet',
    'Receipt', 'Calculator', 'Percent', 'Tag', 'Gift', 'Package', 'Box', 'Truck',
    'Navigation', 'MapPin', 'Compass', 'Map', 'Globe', 'Users', 'UserPlus', 'UserMinus',
    'UserCheck', 'UserX', 'UserCog', 'UserCircle', 'MessageSquare', 'MessageCircle',
    'Mail', 'Send', 'Inbox', 'Outbox', 'Archive', 'Trash', 'Flag', 'Star', 'Heart',
    'ThumbsUp', 'ThumbsDown', 'Award', 'Trophy', 'Medal', 'Crown', 'Gem', 'Diamond',
    'Sparkles', 'Zap', 'Flame', 'Bolt', 'Cloud', 'Sun', 'Moon', 'CloudRain', 'CloudSnow',
    'CloudLightning', 'Wind', 'Droplets', 'Waves', 'Mountain', 'Tree', 'Flower', 'Leaf',
    'Seedling', 'Sprout', 'Plant', 'CalendarDays', 'Trash2', 'ShoppingCart', 'Wallet'
  ];
  
  const mockIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {};
  icons.forEach(name => {
    mockIcons[name] = ({ children, ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} data-testid={`icon-${name.toLowerCase()}`}>{children}</svg>
    );
  });
  
  return mockIcons;
});

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn(), resolvedTheme: 'light' }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// Suppress console.error for React 19 act warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      args[0]?.includes?.('act(...)') ||
      args[0]?.includes?.('Warning: An update to') ||
      args[0]?.includes?.('act(...)')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});