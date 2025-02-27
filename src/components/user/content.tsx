'use client';
import { UserEmail } from './email';
import { UserName } from './name';
import { UserPassword } from './password';
import { UserPhone } from './phone';
import { UserDates } from './dates';

export function UserContent() {
  return (
    <>
      <UserName />
      <UserPassword />
      <UserPhone />
      <UserEmail />
      <UserDates />
    </>
  );
}
