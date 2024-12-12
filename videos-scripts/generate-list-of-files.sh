#!/bin/bash

# Check if the directory is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

DIRECTORY=$1

# Check if the provided argument is a directory
if [ ! -d "$DIRECTORY" ]; then
  echo "Error: $DIRECTORY is not a directory."
  exit 1
fi

# Start the JavaScript array
echo "const fileList = ["

# Loop through each file in the directory
for FILE in "$DIRECTORY"/*; do
  # Check if it's a file (not a directory)
  if [ -f "$FILE" ]; then
    # Extract the filename and add it to the JavaScript array
    FILENAME=$(basename "$FILE")
    echo "  \"$FILENAME\","
  fi
done

# End the JavaScript array
echo "];"


# run:
# bash generateFileList.sh /path/to/directory