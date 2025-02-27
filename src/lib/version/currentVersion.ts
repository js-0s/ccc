import { execFileSync } from 'node:child_process';
import initDebug from 'debug';
const fallbackNoVersion = 'local-development-build';
const debug = initDebug('lib:currentVersion');
export default function currentVersion() {
  if (
    typeof process.env.BUILD_VERSION === 'string' &&
    process.env.BUILD_VERSION.trim().length &&
    process.env.BUILD_VERSION !== '0.0.0-BUILD.VERSION' &&
    process.env.BUILD_VERSION !== 'local-development-build'
  ) {
    debug('utils::version::currentVersion: using BUILD_VERSION');
    // env BUILD_VERSION is the preferred source of the version
    // it is usually generated during build and is available to all
    // workers and the graphql environment
    return process.env.BUILD_VERSION;
  }
  debug('utils::version::currentVersion: using git', process.env.PWD);
  // but it is not available in the jump-host that executes repository methods
  // so we have to figure it out in a similar way
  try {
    const gitDescribeOutput = execFileSync('git', ['describe', '--tags'], {
      encoding: 'utf8',
    });
    if (typeof gitDescribeOutput !== 'string') {
      return fallbackNoVersion;
    }
    const gitVersion = gitDescribeOutput.split(/\n/)[0];
    if (typeof gitDescribeOutput !== 'string') {
      return fallbackNoVersion;
    }
    return gitVersion;
  } catch (error: unknown) {
    if (typeof error === 'string') {
      console.error(
        JSON.stringify({
          origin: 'utils::version::currentVersion',
          message: 'spawn git-child process failed',
          error,
        }),
      );
    }
    if (error instanceof Error) {
      if (error.code) {
        console.error(
          JSON.stringify({
            origin: 'utils::version::currentVersion',
            message: 'spawn git-child process failed',
            error,
          }),
        );
      } else {
        // Child was spawned but exited with non-zero exit code
        // Error contains any stdout and stderr from the child
        const { stdout, stderr }: { stderr: string; stdout: string } = error;

        if (
          stderr.includes(
            'fatal: detected dubious ownership in repository at',
          ) &&
          stderr.includes('git config --global --add safe.directory')
        ) {
          // fallback if running in a task-container where .git is owned by
          // the host. This is executed every time the container is restarted
          // as ~/.gitconfig is not a volume
          try {
            execFileSync('git', [
              'config',
              '--global',
              '--add',
              'safe.directory',
              // make this work for unit-test in ci-runner, usually it would be
              // /app only
              process.env.PWD,
            ]);
            return currentVersion();
          } catch (configError: unknown) {
            if (typeof configError === 'string') {
              console.error(
                JSON.stringify({
                  origin: 'utils::version::currentVersion',
                  message: 'failed to set git config',
                  error: configError,
                }),
              );
            }
            if (configError instanceof Error)
              console.error(
                JSON.stringify({
                  origin: 'utils::version::currentVersion',
                  message: 'failed to set git config',
                  error: configError,
                }),
              );
            console.error(
              JSON.stringify({
                origin: 'utils::version::currentVersion',
                message: 'git exited with error code',
                stdout,
                stderr,
              }),
            );
          }
        }
      }
    }
  }
  return fallbackNoVersion;
}
