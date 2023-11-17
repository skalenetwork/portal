#!/bin/bash

# Set BASE_URL to the provided environment variable, or use the default if it's not set
BASE_URL="${BASE_URL:-https://portal.skale.space}"

# Read the template and replace {BASE_URL} with the actual BASE_URL
sed "s|{BASE_URL}|$BASE_URL|g" sitemap_template.xml > public/sitemap.xml
sed "s|{BASE_URL}|$BASE_URL|g" robots_template.txt > public/robots.txt

echo "Sitemap and robots.txt generated successfully."
