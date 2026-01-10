#!/bin/bash
# Script to start the Serena MCP server for this project
# Requires uv to be installed (which was installed in the previous step)

export PATH=$PATH:$HOME/.local/bin

uvx --from git+https://github.com/oraios/serena serena start-mcp-server --project-from-cwd
