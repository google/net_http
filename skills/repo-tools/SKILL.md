---
name: net-http-tools
description: Tools for interacting with the google/net_http repository.
---

# Net HTTP Tools

This skill contains utilities for working with the `google/net_http` repository.

## Capabilities

### 1. Setup

Sets up the repository in your local environment.

**Goal:**

The `google/net_http` repository is successfully set up on the local machine when:
1.  The `gh` CLI is installed and authenticated.
2.  The repository is cloned into `~/github/net_http`.
3.  The `origin` remote points to the user's fork.
4.  The `upstream` remote points to `https://github.com/google/net_http`.

**Instructions:**

(Skip these steps if the Goal is already met)

1.  **Check for GitHub CLI (`gh`)**
    Check if `gh` is installed.
    ```bash
    which gh
    ```

2.  **Install GitHub CLI (if missing)**
    If `gh` is **NOT** installed, **STOP** and ask the user to run the following
    commands manually.
    **The agent should not run these commands.**
    ```bash
    sudo glinux-add-repo -c github-cli stable && \
    sudo apt update && \
    sudo apt install gh
    ```

3.  **Authenticate GitHub CLI**
    Once `gh` is installed, ensure you are authenticated.
    ```bash
    gh auth login
    ```

4.  **Create Directory**
    Ensure the `~/github` directory exists.
    ```bash
    mkdir -p ~/github
    ```

5.  **Fork Repository**
    Ask the user to fork `https://github.com/google/net_http` if they haven't
    already.
    Then, ask the user for the URL of their personal fork (e.g.,
    `https://github.com/USERNAME/net_http`).

6.  **Clone Fork**
    Clone the user's fork into `~/github/net_http`.
    Replace `<USER_FORK_URL>` with the URL provided by the user.
    ```bash
    gh repo clone <USER_FORK_URL> ~/github/net_http
    ```

7.  **Add Upstream Remote**
    Navigate to the repository and add the upstream remote.
    ```bash
    cd ~/github/net_http
    git remote add upstream https://github.com/google/net_http
    git remote -v
    ```

### 2. Sync Main

Syncs the local `main` branch with the `upstream` repository.

**Goal:**

The local `main` branch is up-to-date with `upstream/main`.

**Instructions:**

1.  **Sync Main Branch**
    Run the following command to sync `main`. If the local `main` has diverged
    from `upstream/main`, it will be renamed to `main_backup_<timestamp>` and
    reset to match upstream.
    ```bash
    cd ~/github/net_http
    git remote prune origin && git remote update && git checkout main

    if [ "$(git rev-list --count upstream/main..main)" -gt 0 ]; then
      BACKUP="main_backup_$(date +%Y%m%d_%H%M)"
      echo "Local main has diverged. Renaming to $BACKUP and resetting to upstream/main."
      git branch -m "$BACKUP"
      git checkout -b main upstream/main
      git push -u origin main --force-with-lease
    else
      git pull upstream main
      git push -u origin main
    fi
    ```
