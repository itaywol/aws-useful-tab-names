# AWS Useful Tab Names

A Chrome extension that automatically renames AWS Console tabs to include account ID, region, and service information, making it easier to identify tabs when working with multiple AWS accounts.

## Problem

When working with multiple AWS accounts and regions simultaneously, browser tabs become difficult to distinguish as they all show similar or identical titles.

## Solution

This extension transforms generic AWS Console tab titles into a concise format: `ACCOUNTID|REGION|SERVICE` where:

- **ACCOUNTID**: Last 4 digits of the AWS account number
- **REGION**: Shortened region name (e.g., "us-east-1" → "us-e1")
- **SERVICE**: The AWS service being accessed

## Features

- Automatically detects and renames AWS Console tabs
- Uses a compact format to maximize information in minimal space
- Works across all AWS regions and services
- Lightweight with minimal permissions required

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and active

## How It Works

The extension monitors tab URL changes and when it detects an AWS console URL:

1. Extracts the account ID from the hostname
2. Identifies the AWS region
3. Determines the service from the URL path
4. Reformats this information into a concise tab title

## Permissions

- **tabs**: Required to modify tab titles
- **AWS console host permissions**: Needed to operate on AWS console pages
