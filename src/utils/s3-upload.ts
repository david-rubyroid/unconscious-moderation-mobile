import * as FileSystem from 'expo-file-system/legacy'

import { logError } from './logger'

export async function uploadToS3(
  presignedUrl: string,
  fileUri: string,
) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri)
    if (!fileInfo.exists) {
      throw new Error('File does not exist')
    }

    // Read file as binary
    const fileBlob = await fetch(fileUri).then(res => res.blob())

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: fileBlob,
    })

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text()
      throw new Error(`S3 upload failed: ${uploadResponse.status} ${text}`)
    }

    return {
      success: true,
      size: fileInfo.size,
    }
  }
  catch (error) {
    logError('Failed to upload to S3', { error })
    return { success: false }
  }
}
