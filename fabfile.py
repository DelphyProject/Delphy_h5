import os

from fabric import task


CI_JOB_ID = os.getenv('CI_JOB_ID')
CI_COMMIT_SHA = os.getenv('CI_COMMIT_SHA')[:7]

APP = os.getenv('APP')
BUILD_TARGET = os.getenv('BUILD_TARGET')

APP_DIR = f'/opt/{APP}'
DEPLOY_TARGET = f'/opt/{APP}/current'
RELEASE_DIR = f'{APP_DIR}/releases/{CI_JOB_ID}_{CI_COMMIT_SHA}'
REMOTE_ARTIFACT_PATH = f'{APP_DIR}/{APP}.tgz'


@task
def deploy(conn):
    conn.put(BUILD_TARGET, REMOTE_ARTIFACT_PATH)

    r = conn.run(f'readlink -ve {DEPLOY_TARGET}', warn=True)
    OLD_RELEASE = r.stdout.strip() if r.ok else None

    conn.run(f'rm -rf {RELEASE_DIR}')
    conn.run(f'mkdir -p {RELEASE_DIR}')

    conn.run(f'tar xzf {REMOTE_ARTIFACT_PATH} -C {RELEASE_DIR}')
    conn.run(f'ln -nfs {RELEASE_DIR} {DEPLOY_TARGET}')

    if OLD_RELEASE:
        conn.run(f'rm -rf {OLD_RELEASE}')
