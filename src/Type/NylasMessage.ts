export interface TypeNylasEmailAttachment
{
	// eslint-disable-next-line @typescript-eslint/naming-convention
	content_disposition?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	content_id?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	content_type: string;
	filename: string;
	content?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	grant_id?: string;
	id?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	is_inline?: boolean;
	size: number;
}

export interface TypeNylasEmailAddress
{
	email: string;
	name?: string
}

export interface TypeNylasEmail
{
	id?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	grant_id?: string;
	object?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	reply_to_message_id?: string;
	attachments: TypeNylasEmailAttachment[];
	from: TypeNylasEmailAddress[];
	to: TypeNylasEmailAddress[];
	bcc: TypeNylasEmailAddress[];
	cc: TypeNylasEmailAddress[];
	// eslint-disable-next-line @typescript-eslint/naming-convention
	reply_to?: TypeNylasEmailAddress[];
	body: string;
	date: number;
	folders?: string[];
	// eslint-disable-next-line @typescript-eslint/naming-convention
	snippet?: string;
	starred?: boolean;
	subject: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	thread_id?: string;
	unread?: boolean;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	send_at?: number;
}

export interface TypeNylasMessageWebhookData
{
	// eslint-disable-next-line @typescript-eslint/naming-convention
	application_id: string;
	object: TypeNylasEmail;
}

export interface TypeNylasMessageWebhookPayload
{
	specversion: string;
	type: string;
	source: string;
	id: string;
	time: number;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	webhook_delivery_attempt: number;
	data: TypeNylasMessageWebhookData;
}
