// import { CalculatedItem } from '../interfaces/calculated-item.interface';
// import { PriceModifier } from '../interfaces/price-modifier.interface';

// class DiscountModifier implements PriceModifier {
//   constructor(private discountRate: number) {}

//   apply(item: CalculatedItem): CalculatedItem {
//     const discount = item.total * this.discountRate;
//     return {
//       ...item,
//       discount,
//       total: item.total - discount,
//     };
//   }
// }
