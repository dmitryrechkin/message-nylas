import type { ZodSchema } from 'zod';
import type { TransformerInterface } from '@dmitryrechkin/foundation-core';
import { messageAttachmentSchema, type TypeMessageAttachment } from '@dmitryrechkin/message-core';
import type { TypeNylasEmailAttachment } from '../Type/NylasMessage';

export interface TypeNylasEmailAttachmentWithMessageId extends TypeNylasEmailAttachment
{
	messageId: string;
}

export class FromNylasEmailAttachmentTransformer implements TransformerInterface<TypeNylasEmailAttachment, TypeMessageAttachment>
{
	/**
	 * Constructor.
	 *
	 * @param {ZodSchema} schema - The schema for the message attachment
	 */
	public constructor(private schema: ZodSchema = messageAttachmentSchema) {}

	/**
	 * Transforms a Nylas TypeNylasEmailAttachment object to a custom TypeMessageAttachment object.
	 *
	 * @param {TypeNylasEmailAttachmentWithMessageId | undefined} input - The Nylas email attachment object
	 * @returns {TypeMessageAttachment | undefined} - The transformed custom message attachment object
	 */
	public transform(input: TypeNylasEmailAttachmentWithMessageId | undefined): TypeMessageAttachment | undefined
	{
		if (!input)
		{
			return undefined;
		}

		const attachment = {
			// attachment path template: /attachments/<ATTACHMENT_ID>/download?message_id=<MESSAGE_ID>
			path: `/attachments/${input.id}/download?message_id=${input.messageId}`,
			filename: input.filename,
			contentDisposition: input.content_disposition
		};

		return this.schema.safeParse(attachment).data;
	}
}
