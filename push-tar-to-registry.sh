#!/bin/bash
set -e

# ./push-tar-to-registry.sh webshop-api_1.1.3.tar 127.0.0.1:5000 webshop-api 1.1.3

IMAGE_TAR="$1"
REGISTRY_URL="${2:-127.0.0.1:5000}"
REPO_NAME="$3"
TAG="${4:-latest}"

if [[ -z "$IMAGE_TAR" || -z "$REPO_NAME" ]]; then
  echo "Uso: $0 <imagem.tar> <repo> [tag] [registry_url]"
  exit 1
fi

TMPDIR=$(mktemp -d)
echo "Extraindo tar em $TMPDIR..."
tar -xf "$IMAGE_TAR" -C "$TMPDIR"

MANIFEST_JSON="$TMPDIR/manifest.json"
if [[ ! -f "$MANIFEST_JSON" ]]; then
  echo "❌ manifest.json não encontrado no tar"
  exit 1
fi

LAYERS=$(jq -r '.[0].Layers[]' "$MANIFEST_JSON")
UPLOAD_DIGESTS=()

for LAYER in $LAYERS; do
  LAYER_PATH="$TMPDIR/$LAYER"
  echo "🔹 Processando camada $LAYER_PATH..."

  DIGEST=$(shasum -a 256 "$LAYER_PATH" | awk '{print $1}')
  UPLOAD_DIGESTS+=("sha256:$DIGEST")

  # Iniciar upload
  LOCATION=$(curl -s -i -X POST "http://$REGISTRY_URL/v2/$REPO_NAME/blobs/uploads/" \
    -H "Content-Type: application/octet-stream" \
    | grep -i Location | awk '{print $2}' | tr -d '\r')

  if [[ -z "$LOCATION" ]]; then
    echo "❌ Falha ao iniciar upload da camada"
    exit 1
  fi

  # Construir URL completa
  if [[ "$LOCATION" != http* ]]; then
    LOCATION="http://$REGISTRY_URL$LOCATION"
  fi

  echo "📦 Fazendo upload da camada com digest sha256:$DIGEST..."
  curl -s -X PUT "$LOCATION&digest=sha256:$DIGEST" \
    --data-binary @"$LAYER_PATH" \
    -H "Content-Type: application/octet-stream"

  echo "✅ Camada enviada"
done

# Criar manifest simples
CONFIG_DIGEST="sha256:$(shasum -a 256 /dev/null | awk '{print $1}')"
MANIFEST=$(jq -n \
  --arg CONFIG_DIGEST "$CONFIG_DIGEST" \
  --argjson LAYERS "$(printf '%s\n' "${UPLOAD_DIGESTS[@]}" | jq -R . | jq -s .)" \
  '{
    schemaVersion: 2,
    mediaType: "application/vnd.docker.distribution.manifest.v2+json",
    config: {
      mediaType: "application/vnd.docker.container.image.v1+json",
      digest: $CONFIG_DIGEST,
      size: 0
    },
    layers: [ $LAYERS[] | { mediaType: "application/vnd.docker.image.rootfs.diff.tar", digest: ., size: 0 } ]
  }'
)

echo "📄 Publicando manifest..."
curl -s -X PUT "http://$REGISTRY_URL/v2/$REPO_NAME/manifests/$TAG" \
  -H "Content-Type: application/vnd.docker.distribution.manifest.v2+json" \
  -d "$MANIFEST"

echo "🎉 Imagem $REPO_NAME:$TAG publicada com sucesso!"