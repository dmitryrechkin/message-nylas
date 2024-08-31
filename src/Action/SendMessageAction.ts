import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import { type RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { type TypeResponse } from '@dmitryrechkin/foundation-core';
import { type TypeEmailMessage } from '@dmitryrechkin/message-core';
import { type TypeNylasEmail } from '../Type/NylasMessage';
import { EnumErrorCode } from '../Type/ErrorCode';
import { ToNylasEmailTransformer } from '../Transformer/ToNylasEmailTransformer';
import { FromNylasEmailTransformer } from '../Transformer/FromNylasEmailTransformer';
import type { TypeNylasResponse } from '@dmitryrechkin/request-sender-nylas';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';
import type { SendMessageActionInterface } from '@dmitryrechkin/message-core';

export class SendMessageAction implements SendMessageActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request.
	 * @param {TransformerInterface<TypeEmailMessage, TypeNylasEmail>} toNylasTransformer - The transformer for converting TypeEmailMessage to TypeNylasEmail.
	 * @param {TransformerInterface<TypeNylasEmail, TypeEmailMessage>} fromNylasTransformer - The transformer for converting TypeNylasEmail back to TypeEmailMessage.
	 */
	public constructor(
		private requestSender: RequestSenderInterface,
		private toNylasTransformer: TransformerInterface<TypeEmailMessage, TypeNylasEmail> = new ToNylasEmailTransformer(),
		private fromNylasTransformer: TransformerInterface<TypeNylasEmail, TypeEmailMessage> = new FromNylasEmailTransformer()
	) {}

	/**
	 * Sends an email message using the Nylas API.
	 *
	 * @param {TypeEmailMessage} message - The email message to be sent.
	 * @returns {Promise<TypeResponse<TypeEmailMessage>>} - The result of the send operation.
	 */
	public async execute(message: TypeEmailMessage): Promise<TypeResponse<TypeEmailMessage>>
	{
		// log the message without an attachment content, because it can be too large
		console.log('Sending email message:', JSON.stringify(message, (key, value) => {
			if (key === 'attachments') {
				return value.map((attachment: { [x: string]: any; content: any; }) => {
					const { content, ...rest } = attachment;
					return rest;
				});
			}
			return value;
		}, 2));

		// Transform the message to Nylas format
		const nylasMessage = this.toNylasTransformer.transform(message);
		if (!nylasMessage)
		{
			console.error('Failed to transform message to Nylas format.');
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Message transformation failed.');
		}

		const path = '/messages/send';

		const response = await this.requestSender.send(path, {method: 'POST', body: JSON.stringify(nylasMessage)});
		if (!response.ok)
		{
			console.error(`Failed to send message: ${JSON.stringify(response)}`);
			return ResponseHelper.createErrorResponse(EnumErrorCode.REQUEST_FAILED, response.statusText);
		}

		const responseJson = await response.json().catch((error) =>
		{
			console.error('Failed to parse response:', error);
			return undefined;
		});
		if (!responseJson)
		{
			console.error('Failed to parse response');
			return ResponseHelper.createErrorResponse(EnumErrorCode.PARSE_ERROR, 'Failed to parse response');
		}

		console.log('Response:', JSON.stringify(responseJson, null, 2));

		const result = responseJson as TypeNylasResponse<TypeNylasEmail>;
		// Transform the response back to TypeEmailMessage
		const newMessage = this.fromNylasTransformer.transform(result.data);
		if (!newMessage)
		{
			console.error('Failed to transform event from Nylas format');
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Failed to transform data');
		}

		// Reassign original attachment content
		message.attachments?.forEach((originalAttachment) =>
		{
			newMessage.attachments?.forEach((attachment) =>
			{
				if (originalAttachment.filename === attachment.filename)
				{
					attachment.content = originalAttachment.content;
				}
			});
		});

		console.log('Email message sent:', message.subject);

		return {success: true, data: newMessage};
	}
}
