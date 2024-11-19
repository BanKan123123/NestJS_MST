#!/bin/bash
# wait-for-it.sh: wait for MongoDB to be ready
host="$1"
port="$2"
timeout="$3"

nc -z "$host" "$port" || { echo "MongoDB is not available at $host:$port"; exit 1; }