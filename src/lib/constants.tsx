import { CreditCard, Landmark, QrCode, Store, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';

// ── CameraForm constants ──

export const CAMERA_TYPES = [
  'DSLR',
  'Mirrorless',
  'Action Cam',
  'Camcorder',
  'Medium Format',
  'Film',
  'Lensa',
  'Baterai',
  'SD Card',
  'Lighting',
  'Reflektor',
  'Mic',
] as const;

export const CATEGORIES = [
  { value: 'camera', label: 'Kamera' },
  { value: 'lens', label: 'Lensa' },
  { value: 'accessory', label: 'Aksesoris' },
] as const;

// ── CartModal constants ──

export type PaymentMethod = {
  id: string;
  label: string;
  group: 'ewallet' | 'bank_transfer' | 'credit_card' | 'convenience_store';
  icon: ReactNode;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'gopay', label: 'GoPay', group: 'ewallet', icon: <Wallet className="w-4 h-4" /> },
  { id: 'qris', label: 'QRIS', group: 'ewallet', icon: <QrCode className="w-4 h-4" /> },
  {
    id: 'shopeepay',
    label: 'ShopeePay',
    group: 'ewallet',
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    id: 'bca_va',
    label: 'BCA Virtual Account',
    group: 'bank_transfer',
    icon: <Landmark className="w-4 h-4" />,
  },
  {
    id: 'bni_va',
    label: 'BNI Virtual Account',
    group: 'bank_transfer',
    icon: <Landmark className="w-4 h-4" />,
  },
  {
    id: 'permata_va',
    label: 'Permata Virtual Account',
    group: 'bank_transfer',
    icon: <Landmark className="w-4 h-4" />,
  },
  {
    id: 'other_va',
    label: 'Bank Lain',
    group: 'bank_transfer',
    icon: <Landmark className="w-4 h-4" />,
  },
  {
    id: 'credit_card',
    label: 'Kartu Kredit',
    group: 'credit_card',
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: 'indomaret',
    label: 'Indomaret',
    group: 'convenience_store',
    icon: <Store className="w-4 h-4" />,
  },
  {
    id: 'alfamart',
    label: 'Alfamart',
    group: 'convenience_store',
    icon: <Store className="w-4 h-4" />,
  },
];

// ── FilterSidebar constants ──

export const CATEGORY_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'camera', label: 'Kamera' },
  { value: 'lens', label: 'Lensa' },
  { value: 'accessory', label: 'Aksesoris' },
] as const;
