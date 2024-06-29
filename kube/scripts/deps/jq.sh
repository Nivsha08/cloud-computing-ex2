#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    Linux*)     
        if [ -f /etc/debian_version ]; then
            # Debian-based distributions
            sudo apt update
            sudo apt install jq -y
        elif [ -f /etc/redhat-release ]; then
            # Red Hat-based distributions
            echo "jq not found, installing..."
            sudo yum install jq -y
        else
            echo "Unsupported Linux distribution"
            return 1
        fi
        ;;
    Darwin*)    
        brew install jq
        ;;
    *)          
        echo "Unsupported operating system"
        return 1
        ;;
esac