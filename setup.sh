#!/bin/bash

# Setup and Deployment Script for the Forge ERP Delivery System

# Function to install dependencies
install_dependencies() {
    echo "Installing dependencies..."
    npm install
}

# Function to build the project
build_project() {
    echo "Building the project..."
    npm run build
}

# Function to deploy the project
deploy_project() {
    echo "Deploying the project..."
    # Assuming deployment to GitHub Pages
    git add -A
    git commit -m "Deploying updates"
    git push origin main # Replace 'main' with the appropriate branch if needed
}

# Main script execution
echo "Starting Setup and Deployment Script..."
install_dependencies
build_project
deploy_project
echo "Deployment completed successfully!"