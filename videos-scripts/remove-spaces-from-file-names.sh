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

# Loop through each file in the directory
for FILE in "$DIRECTORY"/*; do
  # Check if it's a file (not a directory)
  if [ -f "$FILE" ]; then
    # Extract the filename
    FILENAME=$(basename "$FILE")
    
    # Replace spaces with underscores and remove special characters
    NEW_FILENAME=$(echo "$FILENAME" | tr ' ' '_' | tr -cd '[:alnum:]_.')
    
    # Rename the file if the new filename is different
    if [ "$FILENAME" != "$NEW_FILENAME" ]; then
      mv "$DIRECTORY/$FILENAME" "$DIRECTORY/$NEW_FILENAME"
      echo "Renamed: $FILENAME -> $NEW_FILENAME"
    fi
  fi
done


# to run
# bash remove.sh /path/to/directory