'use client';
import { useMemo, createContext, useContext } from 'react';
import { defineAbilityFor, getAbilitySubject } from '@/lib/auth';

const AbilityContext = createContext();
export function AbilityContextProvider({
  session,
  children,
}: {
  session: { user: { id: string } };
}) {
  const ability = useMemo(() => {
    const pureAbility = defineAbilityFor(session?.user);
    pureAbility.subject = getAbilitySubject;
    return pureAbility;
  }, [session]);
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export const useAbilityContext = (): {
  can: (action: string, instance: unknown) => boolean;
  cannot: (action: string, instance: unknown) => boolean;
  relevantRuleFor: (action: string, instance: unknown) => boolean;
  subject: (type: string, instance: unknown) => { id: string };
} => useContext(AbilityContext);
