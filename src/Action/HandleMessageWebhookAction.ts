import { type TypeMessageThread } from '@dmitryrechkin/message-core';
import { type HandleMessageWebhookActionInterface } from '@dmitryrechkin/message-core';
import { type TypeNylasMessageWebhookPayload } from '../Type/NylasMessage';
import { type TypeResponse } from '@dmitryrechkin/foundation-core';
import { FromNylasWebhookPayloadTransformer } from '../Transformer/FromNylasWebhookPayloadTransformer';
import { EnumErrorCode } from '../Type/ErrorCode';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';

export class HandleMessageWebhookAction implements HandleMessageWebhookActionInterface<TypeNylasMessageWebhookPayload>
{
	/**
	 * Constructor.
	 *
	 * @param {TransformerInterface<TypeNylasMessageWebhookPayload, TypeMessageThread>} fromNylasWebhookPayloadTransformer - Transformer for webhook payloads
	 */
	public constructor(
		private fromNylasWebhookPayloadTransformer: FromNylasWebhookPayloadTransformer = new FromNylasWebhookPayloadTransformer()
	) {}

	/**
	 * Handles the webhook payload from the Nylas API.
	 *
	 * @param {TypeNylasMessageWebhookPayload} webhookPayload
	 * @returns {Promise<TypeMessageThread | undefined>}
	 */
	public async execute(webhookPayload: TypeNylasMessageWebhookPayload): Promise<TypeResponse<TypeMessageThread>>
	{
		const messageThread = this.fromNylasWebhookPayloadTransformer.transform(webhookPayload);
		if (!messageThread || messageThread.messages.length === 0)
		{
			console.error('Failed to transform webhook payload to message thread', webhookPayload);
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Failed to transform webhook payload to message thread');
		}

		return {success: true, data: messageThread};
	}
}
