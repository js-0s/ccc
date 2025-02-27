import { queryType } from 'nexus';
import { currentVersion } from '@/lib/version';

export const Query = queryType({
  definition(t) {
    t.field('version', {
      type: 'String',
      description: 'Return deployed backend version.',
      resolve: () => {
        return currentVersion();
      },
    });
    t.field('branch', {
      type: 'String',
      description: 'Return deployed backend version.',
      resolve: () => {
        return process.env.GIT_BRANCH ?? 'local-branch';
      },
    });
  },
});
