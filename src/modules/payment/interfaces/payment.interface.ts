export interface PaymentStrategy {
  apply(amount: number): Promise<boolean>;
  getType(): string;
}
