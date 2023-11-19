# cnc-node

I'M read em I'll tell you how to iunstall me... 


graph TD

    A[Server (server.js)] -->|Handles Webhook| B[Webhook Processor]
    A -->|Handles Update| C[Update Endpoint]
    
    B --> D[GitHub Username]
    B --> E[Make Folder]
    B --> F[Base URL]
    B --> G[Token]
    
    H[src folder] --> I[syncMake.js]
    H --> J[githubWebhookHandler.js]
    
    K[Cronjobs] --> L[auto_commit.sh]
    K --> M[get_from_make.sh]

    L --> N[Git Operations]
    M --> O[Node Sync Script]
