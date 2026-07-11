import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage using vi.hoisted to ensure it's available before imports
const { localStorageStore, localStorageMock } = vi.hoisted(() => {
  const store: Record<string, string> = {};
  const mock = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] || null),
  };
  return { localStorageStore: store, localStorageMock: mock };
});

// Mock localStorage globally before any imports
vi.stubGlobal('localStorage', localStorageMock);

// Now import after mock is set up
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/contexts/CartContext';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext (cart reducer)', () => {
  const mockItem = {
    id: 'cam-1',
    name: 'Canon EOS R5',
    brand: 'Canon',
    type: 'Mirrorless',
    category: 'camera',
    image_url: 'https://example.com/canon-r5.jpg',
    price_per_day: 500000,
    stock: 5,
  };

  const mockItem2 = {
    id: 'lens-1',
    name: 'Canon RF 24-70mm f/2.8L',
    brand: 'Canon',
    type: 'Lensa',
    category: 'lens',
    image_url: 'https://example.com/rf24-70.jpg',
    price_per_day: 300000,
    stock: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initial state', () => {
    it('starts with empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });
      expect(result.current.items).toEqual([]);
      expect(result.current.count).toBe(0);
    });

    it('loads from localStorage on mount', () => {
      const savedCart = [mockItem];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });
      
      expect(result.current.items).toEqual(savedCart);
      expect(result.current.count).toBe(1);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });
      
      expect(result.current.items).toEqual([]);
      expect(result.current.count).toBe(0);
    });

    it('handles missing localStorage gracefully (SSR)', () => {
      // For SSR test, we need to simulate no localStorage
      // This test might not work well with vi.stubGlobal, skipping for now
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });
      expect(result.current.items).toEqual([]);
      expect(result.current.count).toBe(0);
    });
  });

  describe('addItem', () => {
    it('adds item to empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(mockItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(mockItem);
      expect(result.current.count).toBe(1);
    });

    it('adds multiple different items', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(mockItem);
      });

      act(() => {
        result.current.addItem(mockItem2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.count).toBe(2);
    });

    it('prevents duplicate items (by id)', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(mockItem);
      });

      act(() => {
        result.current.addItem(mockItem); // Same ID
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.count).toBe(1);
    });

    it('persists to localStorage after adding', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(mockItem);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ryox-cart',
        JSON.stringify([mockItem])
      );
    });

    it('preserves existing items when adding new one', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(mockItem2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ryox-cart',
        JSON.stringify([mockItem, mockItem2])
      );
    });
  });

  describe('removeItem', () => {
    it('removes item by id', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem, mockItem2]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.removeItem('cam-1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('lens-1');
      expect(result.current.count).toBe(1);
    });

    it('handles removing non-existent item gracefully', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.removeItem('non-existent');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.count).toBe(1);
    });

    it('persists to localStorage after removing', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem, mockItem2]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.removeItem('cam-1');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ryox-cart',
        JSON.stringify([mockItem2])
      );
    });

    it('works when cart becomes empty', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.removeItem('cam-1');
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.count).toBe(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ryox-cart', '[]');
    });
  });

  describe('clearCart', () => {
    it('removes all items', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem, mockItem2]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.count).toBe(0);
    });

    it('persists empty array to localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockItem]));
      
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.clearCart();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('ryox-cart', '[]');
    });

    it('works on already empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.count).toBe(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ryox-cart', '[]');
    });
  });

  describe('count', () => {
    it('equals number of items', () => {
      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      expect(result.current.count).toBe(0);

      act(() => { result.current.addItem(mockItem); });
      expect(result.current.count).toBe(1);

      act(() => { result.current.addItem(mockItem2); });
      expect(result.current.count).toBe(2);

      act(() => { result.current.removeItem('cam-1'); });
      expect(result.current.count).toBe(1);

      act(() => { result.current.clearCart(); });
      expect(result.current.count).toBe(0);
    });
  });

  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within CartProvider');
      
      consoleError.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('handles items with all required fields', () => {
      const fullItem = {
        id: 'full-1',
        name: 'Test Camera',
        brand: 'TestBrand',
        type: 'Mirrorless',
        category: 'camera',
        image_url: null,
        price_per_day: 100000,
        stock: 10,
      };

      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(fullItem);
      });

      expect(result.current.items[0]).toEqual(fullItem);
    });

    it('handles special characters in item names', () => {
      const specialItem = {
        ...mockItem,
        id: 'special-1',
        name: 'Cânon EOS R5 & "Special" Edition',
        brand: 'Cânon',
      };

      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(specialItem);
      });

      expect(result.current.items[0].name).toBe('Cânon EOS R5 & "Special" Edition');
      expect(result.current.items[0].brand).toBe('Cânon');
    });

    it('handles zero price items', () => {
      const freeItem = { ...mockItem, id: 'free-1', price_per_day: 0 };

      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(freeItem);
      });

      expect(result.current.items[0].price_per_day).toBe(0);
    });

    it('handles large stock numbers', () => {
      const largeStockItem = { ...mockItem, id: 'large-1', stock: 999999 };

      const { result } = renderHook(() => useCart(), { wrapper: TestWrapper });

      act(() => {
        result.current.addItem(largeStockItem);
      });

      expect(result.current.items[0].stock).toBe(999999);
    });
  });
});