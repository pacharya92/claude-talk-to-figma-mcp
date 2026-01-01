#!/bin/bash

# Load nvm and use the version from .nvmrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Change to script directory's parent (project root)
cd "$(dirname "$0")/.."

# Use the version specified in .nvmrc
nvm use > /dev/null 2>&1

# Execute the passed command
exec "$@"
