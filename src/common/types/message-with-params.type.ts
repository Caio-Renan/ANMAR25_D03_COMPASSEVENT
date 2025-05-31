export type MessageWithParams<T extends readonly unknown[]> = (...args: T) => string;
