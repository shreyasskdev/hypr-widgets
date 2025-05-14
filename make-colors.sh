#!/bin/bash

# Get the current wallpaper path from swww
wallpaper_path=$(swww query | grep -oP 'image: \K.*')

# Check if the file exists
if [[ -f "$wallpaper_path" ]]; then
    echo "Using wallpaper: $wallpaper_path"
    
    # Generate color scheme using wal
    wal -i "$wallpaper_path" --backend auto
    mv ~/.cache/wal/colors.scss  ./styles/colors.scss

    echo "Color scheme generated with wal."
else
    echo "Wallpaper not found or swww not running properly."
    exit 1
fi
