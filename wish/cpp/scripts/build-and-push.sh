#!/usr/bin/env bash
# build-and-push.sh
# Builds wish-server and wish-bench-client images, pushes them to Artifact Registry.
#
# Prerequisites:
#   gcloud auth configure-docker "${REGION}-docker.pkg.dev"
#   (or: gcloud auth login && gcloud auth application-default login)
#
# Usage:
#   REGION=asia-northeast1 PROJECT=my-gcp-project REPOSITORY=wish ./scripts/build-and-push.sh
#
# Optional env vars:
#   TAG          – image tag (default: git short SHA or "latest")
#   PUSH         – set to "false" to build only without pushing
#   FRESH        – set to "true" to bypass all caches (re-downloads FetchContent deps)

set -euo pipefail

REGION="${REGION:?Set REGION, e.g. asia-northeast1}"
PROJECT="${PROJECT:?Set PROJECT to your GCP project ID}"
REPOSITORY="${REPOSITORY:?Set REPOSITORY to your Artifact Registry repo name}"

REGISTRY="${REGION}-docker.pkg.dev/${PROJECT}/${REPOSITORY}"

# Use git short SHA as default tag for reproducibility; fall back to "latest".
if git rev-parse --short HEAD &>/dev/null; then
    DEFAULT_TAG="$(git rev-parse --short HEAD)"
else
    DEFAULT_TAG="latest"
fi
TAG="${TAG:-${DEFAULT_TAG}}"
PUSH="${PUSH:-true}"
FRESH="${FRESH:-false}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# The build context is one level above scripts/.
CTX="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==> Build context : ${CTX}"
echo "==> Registry      : ${REGISTRY}"
echo "==> Tag           : ${TAG}"
echo "==> Fresh build   : ${FRESH}"
echo ""

build_and_push() {
    local name="$1"
    local dockerfile="$2"
    local full_tag="${REGISTRY}/${name}:${TAG}"
    local latest_tag="${REGISTRY}/${name}:latest"

    echo "==> Building ${full_tag} ..."
    local extra_flags=()
    [[ "${FRESH}" == "true" ]] && extra_flags+=(--no-cache)
    DOCKER_BUILDKIT=1 docker build \
        --file "${CTX}/${dockerfile}" \
        --tag "${full_tag}" \
        --tag "${latest_tag}" \
        "${extra_flags[@]}" \
        "${CTX}"

    if [[ "${PUSH}" == "true" ]]; then
        echo "==> Pushing ${full_tag} ..."
        docker push "${full_tag}"
        docker push "${latest_tag}"
    fi
}

build_and_push "echo-server" "Dockerfile.echo_server"
build_and_push "benchmark" "Dockerfile.benchmark"
