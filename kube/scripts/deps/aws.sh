#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    Linux*)
        if [ -f /etc/debian_version ]; then
            sudo apt update
            sudo apt install awscli -y
        elif [ -f /etc/redhat-release ]; then
            sudo yum install awscli -y
        else
            echo "Unsupported Linux distribution for AWS CLI installation."
            return 1
        fi
        ;;
    Darwin*)
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew install awscli
        ;;
    *)
        echo "Unsupported operating system for AWS CLI installation."
        return 1
        ;;
esac