#!/bin/bash

# Check if a directory is provided as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Get the directory from the first argument
DIRECTORY=$1

# Check if the provided argument is a directory
if [ ! -d "$DIRECTORY" ]; then
    echo "Error: $DIRECTORY is not a directory"
    exit 1
fi

# Loop through all files in the directory
for file in "$DIRECTORY"/*; do
    # Skip directories
    [ -d "$file" ] && continue

    # Get the file extension
    extension="${file##*.}"

    # Check if the file is not an mp4 file
    if [ "$extension" != "mp4" ]; then
        # Define the output file name with .mp4 extension
        output="${file%.*}.mp4"
        
        # Convert the file to .mp4 using ffmpeg
        ffmpeg -i "$file" "$output"

        # Check if the conversion was successful
        if [ $? -eq 0 ]; then
            echo "Converted $file to $output"
        else
            echo "Failed to convert $file"
        fi
    fi
done