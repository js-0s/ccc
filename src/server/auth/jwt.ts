export async function jwt({
  token,
  user,
}: {
  token: { sub: string };
  user: { roles: [string] };
}) {
  if (user) {
    return { ...token, roles: user.roles };
  }
  return token;
}
