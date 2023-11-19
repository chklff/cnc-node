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


```mermaid
graph TD
    A[server.js] -->|Imports| B[Modules]
    B -->|express| C[Express App]
    B -->|winston| D[Logger]
    B -->|dotenv| E[Environment Variables]
    B -->|processWebhook| F[Webhook Handler]
    C -->|Middleware| G[express.json()]
    D -->|Logging Setup| H[File and Console Logging]
    E -->|Config Values| I[PORT, SERVER, etc.]
    C -->|Routes| J[Route Handlers]
    J -->|POST /update| K[Log and Respond to Update Requests]
    J -->|Commented GET /scenarios| L[Scenarios Handler (Commented)]
    J -->|POST /webhook| M[Handle Webhook and Log]
    M --> F
    C -->|Server Listen on Port| N[Server Initialization]
```
