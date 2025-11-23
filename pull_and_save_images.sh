#!/bin/bash

LOG_FILE="build_and_save_images.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "Starting build and save images script"

# log "Building frontend"
# cd ./merchant-comercios || { log "Failed to cd to merchant-comercios"; exit 1; }
# VITE_GESTION_INTERNA_URL=http://10.134.14.4:8333 npm run build

# log "Building frontend Docker image"
# docker compose -f docker-compose.frontend.yml build

# log "Building backend"
# cd ../api-gestion-interna || { log "Failed to cd to api-gestion-interna"; exit 1; }

# log "Building backend Docker images"
# docker compose -f docker-compose.production.yml build

log "Saving Docker images"
docker save -o docker_images/my_full_stack-backend.tar my_full_stack-backend
docker save -o docker_images/my_full_stack-nginx_backend.tar my_full_stack-nginx_backend
docker save -o docker_images/my_full_stack-nginx_frontend.tar my_full_stack-nginx_frontend
docker save -o docker_images/my_full_stack-traefik.tar my_full_stack-traefik
docker save -o docker_images/my_stack_production_postgres.tar my_stack_production_postgres

log "Creating zip archive"
cd docker_images || { log "Failed to cd to docker_images"; exit 1; }
zip -r docker_images.zip ./*.tar

log "Script execution completed"