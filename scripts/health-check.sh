#!/bin/bash
# scripts/health-check.sh

MAX_RETRIES=10
RETRY_INTERVAL=5

check_health() {
    local service=$1
    local port=$2
    local retries=0

    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -s http://localhost:$port/health > /dev/null; then
            echo "$service is healthy"
            return 0
        fi

        retries=$((retries + 1))
        sleep $RETRY_INTERVAL
    done

    echo "$service failed health check"
    return 1
}

check_health "backend" 3001
check_health "frontend" 3000