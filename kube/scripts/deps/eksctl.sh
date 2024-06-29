#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    Linux*)
        curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
        sudo mv /tmp/eksctl /usr/local/bin
        ;;
    Darwin*)
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew tap weaveworks/tap
        brew install weaveworks/tap/eksctl
        ;;
    *)
        echo "Unsupported operating system for eksctl installation."
        exit 1
        ;;
esac