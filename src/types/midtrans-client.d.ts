export {};

declare module 'midtrans-client' {
  export class Snap {
    constructor(config: {
      serverKey: string;
      clientKey: string;
      environment: 'sandbox' | 'production';
      isProduction: boolean;
    });
    createTransaction(
      parameter: Record<string, unknown>,
    ): Promise<{ token: string; redirect_url: string }>;
    transaction: {
      status(orderId: string): Promise<Record<string, unknown>>;
      approve(orderId: string): Promise<Record<string, unknown>>;
      cancel(orderId: string): Promise<Record<string, unknown>>;
      deny(orderId: string): Promise<Record<string, unknown>>;
      expire(orderId: string): Promise<Record<string, unknown>>;
    };
  }
}

declare global {
  interface Window {
    snap: {
      pay(
        token: string,
        callbacks: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        },
      ): void;
    };
  }
}
