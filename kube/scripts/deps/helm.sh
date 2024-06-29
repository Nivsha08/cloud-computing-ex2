#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    Linux*)
        curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
        chmod 700 get_helm.sh
        ./get_helm.sh
        ;;
    Darwin*)
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew install helm
        ;;
    *)
        echo "Unsupported operating system for Helm installation."
        exit 1
        ;;
esac