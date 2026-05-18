#!/bin/sh
set -e
exec serve -s build -l "${PORT:-3000}"