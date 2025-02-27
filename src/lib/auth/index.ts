import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability';
export function getAbilitySubject(typeName: string, instance: unknown) {
  return subject(typeName, instance);
}

export function defineAbilityFor(user: { id: string; roles: [string] }) {
  const { can, rules } = new AbilityBuilder(createMongoAbility);
  if (!user) {
    // ^^
    // this is the minimum a public non-authenticated user can do
    return createMongoAbility(rules);
  }
  if (user?.roles?.includes('admin')) {
    can(['read', 'update', 'create', 'remove', 'list'], 'User');
  }
  can(['read', 'update'], 'User', { id: user.id });

  return createMongoAbility(rules);
}
