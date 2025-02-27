import { useData } from './data';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
export function UserDates() {
  const { user } = useData();
  return (
    <div>
      <p>
        lastSignin:{' '}
        <span title={dayjs(user.lastSigninAt).toString()}>
          {dayjs(user.lastSigninAt).fromNow()}
        </span>
      </p>
      {user.lastSignoutAt !== null && (
        <p>
          lastSignout:{' '}
          <span title={dayjs(user.lastSignoutAt).toString()}>
            {dayjs(user.lastSignoutAt).fromNow()}
          </span>
        </p>
      )}
      {user.createdAt !== null && (
        <p>
          createdAt:{' '}
          <span title={dayjs(user.createdAt).toString()}>
            {dayjs(user.createdAt).fromNow()}
          </span>
        </p>
      )}
    </div>
  );
}
