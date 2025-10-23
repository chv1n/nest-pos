import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { TransactionModule } from './transaction/transaction.module';

export const AppModules = [
  UsersModule,
  AuthModule,
  RolesModule,
  CategoriesModule,
  ProductsModule,
  TransactionModule,
];
