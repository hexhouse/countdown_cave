#!/bin/sh

cd app
while :; do
  npx --yes electron --no-sandbox .
done
