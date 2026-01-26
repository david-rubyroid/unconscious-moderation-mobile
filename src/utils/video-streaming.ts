import { logDebug, logWarn } from './logger'

/**
 * Utilities for working with video streaming
 */

/**
 * Checks HTTP Range Requests support on the server
 * @param videoUrl Video file URL
 * @returns Promise with information about Range Requests support
 */
export async function checkRangeRequestSupport(videoUrl: string): Promise<{
  supportsRange: boolean
  contentLength?: number
  acceptRanges?: string
  error?: string
}> {
  try {
    const response = await fetch(videoUrl, {
      method: 'HEAD',
      headers: {
        Range: 'bytes=0-1023',
      },
    })

    const acceptRanges = response.headers.get('Accept-Ranges')
    const contentRange = response.headers.get('Content-Range')
    const contentLength = response.headers.get('Content-Length')

    const supportsRange
      = response.status === 206 // Partial Content
        || (acceptRanges === 'bytes' && contentRange !== null)

    return {
      supportsRange,
      contentLength: contentLength ? Number.parseInt(contentLength, 10) : undefined,
      acceptRanges: acceptRanges || undefined,
    }
  }
  catch (error) {
    return {
      supportsRange: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Gets video file size without downloading the entire file
 * @param videoUrl Video file URL
 * @returns Promise with file size in bytes
 */
export async function getVideoFileSize(videoUrl: string): Promise<number | null> {
  try {
    const response = await fetch(videoUrl, {
      method: 'HEAD',
    })

    const contentLength = response.headers.get('Content-Length')
    return contentLength ? Number.parseInt(contentLength, 10) : null
  }
  catch {
    logWarn('Failed to get video file size', { videoUrl })
    return null
  }
}

/**
 * Formats file size into a human-readable format
 * @param bytes Size in bytes
 * @returns Formatted string (e.g., "150.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

/**
 * Logs streaming information for debugging
 * @param videoUrl Video URL
 * @param playerStatus VideoPlayer status
 */
export function logStreamingInfo(
  videoUrl: string,
  playerStatus: string,
): void {
  logDebug('[Video Streaming]', {
    url: videoUrl,
    status: playerStatus,
    timestamp: new Date().toISOString(),
  })
}
