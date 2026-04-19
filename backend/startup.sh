#!/bin/sh
# Render injects $PORT dynamically; fall back to 8080 for local Docker runs.
exec dotnet backend.dll --urls "http://0.0.0.0:${PORT:-8080}"
