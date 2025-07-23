# Make-CNC Sync Tool

A bidirectional synchronization tool that connects GitHub repositories with Make.com automation platform, enabling seamless workflow management between version control and automation scenarios.

## Overview

Make-CNC is a Node.js application that facilitates automatic synchronization between GitHub repositories and Make.com scenarios. It provides webhook-based integration that updates Make.com scenarios when GitHub repository changes occur, and periodically syncs Make.com data back to GitHub.

## Key Features

- **GitHub Webhook Integration**: Automatically processes GitHub push events
- **Bidirectional Sync**: Syncs changes from GitHub to Make.com and vice versa
- **Scenario Management**: Fetches and manages Make.com scenarios as JSON files
- **Application Data Sync**: Downloads Make.com application configurations, modules, RPCs, and functions
- **Automated Cron Jobs**: Scheduled synchronization tasks
- **Comprehensive Logging**: Winston-based logging with file and console output

## Architecture

### Core Components

- **`server.js`**: Express.js server handling webhook endpoints and API routes
- **`githubWebhookHandler.js`**: Processes GitHub webhook events and manages sync operations
- **`scenarios.js`**: Fetches Make.com scenarios and saves them as JSON files
- **`applications.js`**: Downloads comprehensive Make.com application data
- **`syncMake.js`**: Orchestrates synchronization operations

### Sync Process

1. **GitHub → Make.com**: When changes are pushed to GitHub, webhooks trigger updates to corresponding Make.com scenarios
2. **Make.com → GitHub**: Periodic cron jobs fetch latest scenarios and application data from Make.com
3. **Conflict Prevention**: Commits with "Sync From Make" message are ignored to prevent sync loops

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cnc-node
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Required Environment Variables

```env
PORT=3000
SERVER=localhost
GITHUB_USERNAME=your-github-username
INSTANCE_URL=https://your-make-instance.make.com
MAKE_API_KEY=your-make-api-key
MAKE_ORG_ID=your-organization-id
MAKE_FOLDER_PATH=/path/to/sync/folder
NODE_ENV=development
```

### GitHub Webhook Setup

1. In your GitHub repository, go to Settings → Webhooks
2. Add webhook URL: `http://your-server:3000/webhook`
3. Select "Push" events
4. Set content type to `application/json`

## Usage

### Starting the Server

```bash
node server.js
```

The server will start on the configured port and begin listening for webhook events.

### Manual Sync Operations

Run individual sync operations:

```bash
# Sync scenarios from Make.com
node src/syncMake.js

# Test application fetching
node src/applications.js
```

### Cron Jobs

The system includes automated cron jobs:

- **`get_from_make.sh`**: Runs periodic sync from Make.com to GitHub
- **`auto_commit.sh`**: Handles automated commits for synced changes

## API Endpoints

### POST `/webhook`
Receives GitHub webhook events and processes repository changes.

**Request**: GitHub webhook payload
**Response**: `{ message: 'Webhook received' }`

### POST `/update`
Test endpoint for basic server functionality.

**Request**: `{ data: "test" }`
**Response**: `{ test: "ok" }`

### GET `/scenarios`
Reserved endpoint for scenario management (implementation pending).

## File Structure

```
cnc-node/
├── server.js              # Main Express server
├── src/
│   ├── githubWebhookHandler.js  # Webhook processing logic
│   ├── scenarios.js        # Make.com scenario management
│   ├── applications.js     # Application data fetching
│   └── syncMake.js        # Sync orchestration
├── cronjobs/
│   ├── get_from_make.sh   # Periodic sync script
│   └── auto_commit.sh     # Auto-commit script
├── tests/                 # Test files
├── install/               # Installation documentation
└── logs/                  # Application logs
```

## Logging

The application uses Winston for comprehensive logging:

- **`error.log`**: Error-level messages only
- **`combined.log`**: All log levels
- **Console**: Development environment output

## Development

### Testing

```bash
# Run basic functionality tests
node tests/debug.js
node tests/scenarios.js
```

### Debugging

Enable detailed logging by setting `NODE_ENV=development` in your environment variables.

## Security Considerations

- API keys and tokens are stored in environment variables
- GitHub webhook validation should be implemented for production use
- File system access is restricted to configured directories
- Rate limiting is implemented for Make.com API calls

## Troubleshooting

### Common Issues

1. **Webhook not triggering**: Verify GitHub webhook configuration and server accessibility
2. **Make.com API errors**: Check API key validity and rate limits
3. **File permission errors**: Ensure proper write permissions for sync directories
4. **Sync loops**: Verify commit message filtering is working correctly

### Log Analysis

Check log files for detailed error information:
```bash
tail -f combined.log
tail -f error.log
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

BSD 3-Clause License

## Support

For issues and questions, please check the logs first, then create an issue in the GitHub repository with relevant log excerpts and configuration details.