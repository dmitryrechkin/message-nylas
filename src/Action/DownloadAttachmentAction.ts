import { Base64 } from '@dmitryrechkin/base64';
import { type TypeMessageAttachment } from '@dmitryrechkin/message-core';
import { type RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { type TypeResponse } from '@dmitryrechkin/foundation-core';
import { EnumErrorCode } from '../Type/ErrorCode';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';
import type { DownloadAttachmentActionInterface } from '@dmitryrechkin/message-core';

export class DownloadAttachmentAction implements DownloadAttachmentActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request
	 */
	public constructor(private requestSender: RequestSenderInterface) {}

	/**
	 * Downloads an attachment from the Nylas API.
	 *
	 * @param {TypeMessageAttachment} attachment
	 * @returns {Promise<TypeMessageAttachment>}
	 */
	public async execute(attachment: TypeMessageAttachment): Promise<TypeResponse<TypeMessageAttachment>>
	{
		console.log('Downloading attachment:', attachment.path);

		if (attachment.content && attachment.content.length > 0)
		{
			console.log('Attachment already downloaded:', attachment.path);
			return {success: true, data: attachment};
		}

		const response = await this.requestSender.send(attachment.path ?? '', {method: 'GET'});
		if (!response.ok)
		{
			console.error(`Failed to download attachment: ${response.statusText}`);
			return ResponseHelper.createErrorResponse(EnumErrorCode.DOWNLOAD_FAILED, response.statusText);
		}

		console.log('Attachment downloaded:', attachment.path);

		const buffer = await response.arrayBuffer();
		attachment.content = Base64.encode(new Uint8Array(buffer));

		return {success: true, data: attachment};
	}
}
