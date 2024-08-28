# Message Nylas

**Message Nylas is a TypeScript library that integrates with the Nylas API to manage messages, attachments, and webhooks.** This package provides a set of tools and actions to interact with Nylas messages, making it easy to send messages, handle webhooks, and manage attachments within the Nylas ecosystem.

## Installation

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/message-nylas
```

## Features

- **Message Management**: Send and manage messages within the Nylas platform.
- **Attachment Handling**: Download and manage attachments associated with messages.
- **Webhook Integration**: Seamlessly handle webhooks for incoming messages and other events.
- **Nylas API Integration**: Directly interact with the Nylas API using platform-independent code, ensuring compatibility with serverless environments like Cloudflare Workers.
- **Action-Based Design**: Perform specific message operations using dedicated actions, promoting clean and modular code.

## Usage

### Sending a Message

```typescript
import { SendMessageAction } from '@dmitryrechkin/message-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';
import { TypeNylasAuthentication } from '@dmitryrechkin/request-sender-nylas';

const auth: TypeNylasAuthentication = {
    apiKey: 'your-nylas-api-key',
    apiUrl: 'https://api.nylas.com',
    grantId: 'your-grant-id'
};

const nylasSender = new NylasRequestSender(auth);
const sendMessageAction = new SendMessageAction(nylasSender);

const messageData = {
    to: ['recipient@example.com'],
    subject: 'Meeting Reminder',
    body: 'This is a reminder for our meeting tomorrow at 10 AM.'
};

const response = await sendMessageAction.execute(messageData);
console.log('Sent message ID:', response.data?.id);
```

### Handling a Webhook

```typescript
import { HandleMessageWebhookAction } from '@dmitryrechkin/message-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';

const nylasSender = new NylasRequestSender(auth);
const handleWebhookAction = new HandleMessageWebhookAction(nylasSender);

const webhookData = {
    message_id: 'message-id',
    event: 'message.created',
    payload: {/* webhook payload */}
};

const response = await handleWebhookAction.execute(webhookData);
console.log('Handled webhook for message ID:', webhookData.message_id);
```

### Downloading an Attachment

```typescript
import { DownloadAttachmentAction } from '@dmitryrechkin/message-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';

const nylasSender = new NylasRequestSender(auth);
const downloadAttachmentAction = new DownloadAttachmentAction(nylasSender);

const attachmentData = {
    attachment_id: 'attachment-id',
};

const response = await downloadAttachmentAction.execute(attachmentData);
console.log('Downloaded attachment:', response.data);
```

## When to Use

`Message Nylas` is perfect for applications that need to integrate with Nylas for managing messages, handling webhooks, and processing attachments. It provides a clean, action-based API that simplifies the complexities of interacting with Nylas, allowing you to focus on building features rather than managing API calls.

## Installation & Setup

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/message-nylas
```

Ensure your project is set up to handle TypeScript and supports ES modules, as this library is built with modern JavaScript standards.

## Rationale

### Platform Independence for Serverless Environments

The `Message Nylas` library was created to address the limitations of the original Nylas package, which depends heavily on Node.js-specific modules, making it incompatible with serverless environments such as Cloudflare Workers. This library is platform-independent, ensuring that it can be used in serverless platforms without any issues, making it an ideal choice for modern cloud-based applications.

### Action-Based Design for Clean Code

The `Message Nylas` library is designed with an action-based approach, meaning each message operation is encapsulated within a specific action class. This design promotes clean, modular code, making it easier to maintain and extend your application.

- **Focused Actions**: Each action class focuses on a specific operation, such as sending messages or handling webhooks, making your code more readable and maintainable.
- **Seamless Integration**: By leveraging the `NylasRequestSender` class from `Request Sender Nylas`, you can easily handle authentication and request sending without writing boilerplate code.
- **Scalable and Extensible**: The action-based architecture allows you to easily add new message-related features as your application grows.

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests. Before submitting, please ensure your code passes all linting and unit tests.

You can run unit tests using:

```bash
pnpm test
```