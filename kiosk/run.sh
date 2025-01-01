#!/bin/sh

cd app
npm i

while :; do
  npx electron --no-sandbox .
done
