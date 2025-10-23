import { Repository, ObjectLiteral } from 'typeorm';

export async function createNewId<
  T extends ObjectLiteral,
  K extends keyof T & string,
>(repo: Repository<T>, prefix: string, field: keyof K): Promise<string> {
  const lastRecord = await repo
    .createQueryBuilder('t')
    .select(`t.${String(field)}`, 'id')
    .orderBy(`t.${String(field)}`, 'DESC')
    .limit(1)
    .getRawOne<{ id: string | null }>();

  const lastId = lastRecord
    ? parseInt(String(lastRecord.id).replace(/\D/g, ''), 10)
    : 0;
  const newId = `${prefix}${String(lastId + 1).padStart(5, '0')}`;

  return newId;
}
