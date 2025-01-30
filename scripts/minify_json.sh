#!/bin/bash

if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed"
    exit 1
fi

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory '$TARGET_DIR' does not exist"
    exit 1
fi

find "$TARGET_DIR" -type f -name "*.json" -print0 | while IFS= read -r -d $'\0' file; do
    echo "Processing: $file"
    if jq empty "$file" 2>/dev/null; then
        temp_file=$(mktemp)
        if jq -c '.' "$file" > "$temp_file"; then
            mv "$temp_file" "$file"
            echo "✓ $file"
        else
            rm -f "$temp_file"
            echo "✗ $file"
        fi
    else
        echo "✗ Invalid JSON: $file"
    fi
done