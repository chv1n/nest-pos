import { CalculatedItem } from './calculated-item.interface';

export interface PriceModifier {
  apply(item: CalculatedItem): CalculatedItem;
}
