import { HttpException, HttpStatus } from '@nestjs/common';

export const canCreateMap: Record<string, string[]> = {
  Admin: ['Manager', 'Cashier'],
  Manager: ['Cashier'],
  Cashier: [],
};

export function canCreateUser(creator: string, target: string) {
  return canCreateMap[creator].includes(target) ?? false;
}

export function acceptCreateUser(creator: string, target: string) {
  if (!canCreateUser(creator, target)) {
    throw new HttpException(
      `Role "${creator}" is not allowed to create role "${target}"`,
      HttpStatus.FORBIDDEN,
    );
  }
}
