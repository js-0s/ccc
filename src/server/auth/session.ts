export async function session({
  session,
  token,
}: {
  session: { user: { id: string } };
  token: { sub: string; roles: [string] };
}) {
  return {
    ...session,
    user: {
      ...session.user,
      id: token.sub,
      roles: token.roles,
    },
  };
}
