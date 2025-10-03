import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';


export const AppModules = [
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule
];
