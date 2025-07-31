#!/bin/bash

echo "🚀 Setting up GitHub repository for Kaya CEO Demo"
echo "=================================================="

# Get repository name from user
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: kaya-ceo-demo): " REPO_NAME
REPO_NAME=${REPO_NAME:-kaya-ceo-demo}

echo ""
echo "📋 Repository Details:"
echo "Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists. Current URL:"
    git remote get-url origin
    read -p "Do you want to update it? (y/n): " UPDATE_REMOTE
    if [[ $UPDATE_REMOTE == "y" || $UPDATE_REMOTE == "Y" ]]; then
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    fi
else
    echo "➕ Adding remote origin..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: $REPO_NAME"
echo "3. Description: Kaya CEO Demo with comprehensive QA testing framework"
echo "4. Choose Public or Private"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
echo "7. After creating the repository, run:"
echo "   git push -u origin main"
echo ""
echo "🔗 Repository URL will be: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

read -p "Press Enter when you've created the repository on GitHub..." 