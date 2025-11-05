import { SaleStatus } from '../enum/sale-status.enum';

export interface UpdateSale {
  paid_amount?: number;
  change?: number;
  status?: SaleStatus;
  payment_method?: string;
}
