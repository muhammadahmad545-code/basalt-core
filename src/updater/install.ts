import { Directory, File, Paths } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';
import { UserFacingError } from '../utils/errors';
import type { UpdateInfo } from './github';

const FLAG_GRANT_READ_URI_PERMISSION = 0x00000001;
const FLAG_ACTIVITY_NEW_TASK = 0x10000000;

function updatesDir(): Directory {
  const dir = new Directory(Paths.cache, 'updates');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

/** Remove APKs left over from earlier updates so they do not pile up in the cache. */
export function clearDownloadedUpdates(): void {
  try {
    const dir = new Directory(Paths.cache, 'updates');
    if (dir.exists) dir.delete();
  } catch {
    // Best effort.
  }
}

/**
 * Download the release APK and verify it before anyone is asked to install it.
 * Size is always checked; SHA-256 is checked whenever the release publishes one.
 */
export async function downloadUpdate(
  update: UpdateInfo,
  onProgress?: (fraction: number) => void,
  signal?: AbortSignal,
): Promise<File> {
  if (Paths.availableDiskSpace < update.sizeBytes * 2) {
    throw new UserFacingError('no-space', 'Not enough free storage to download the update.');
  }
  const target = new File(updatesDir(), `update-${update.version}.apk`);
  if (target.exists) target.delete();

  let file: File;
  try {
    file = await File.downloadFileAsync(update.apkUrl, target, {
      idempotent: true,
      signal,
      onProgress: ({ bytesWritten, totalBytes }) => {
        const total = totalBytes > 0 ? totalBytes : update.sizeBytes;
        if (total > 0) onProgress?.(Math.min(1, bytesWritten / total));
      },
    });
  } catch (cause) {
    if (signal?.aborted) throw new UserFacingError('cancelled', 'Download cancelled.');
    throw new UserFacingError('download-failed', 'Could not download the update. Check your connection and try again.', { cause });
  }

  if (update.sizeBytes > 0 && file.size !== update.sizeBytes) {
    file.delete();
    throw new UserFacingError('size-mismatch', 'The download was incomplete. Please try again.');
  }
  if (update.sha256) {
    const actual = (await file.digest('SHA-256')).toLowerCase();
    if (actual !== update.sha256) {
      file.delete();
      throw new UserFacingError('checksum-mismatch', 'The downloaded update failed its integrity check and was discarded.');
    }
  }
  return file;
}

/** Hand the verified APK to Android's package installer. The user confirms the install there. */
export async function installUpdate(file: File): Promise<void> {
  if (Platform.OS !== 'android') {
    throw new UserFacingError('unsupported', 'In-app updates are only available on Android.');
  }
  try {
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: file.contentUri,
      type: 'application/vnd.android.package-archive',
      flags: FLAG_GRANT_READ_URI_PERMISSION | FLAG_ACTIVITY_NEW_TASK,
    });
  } catch (cause) {
    throw new UserFacingError('install-failed', 'Could not open the installer. Allow this app to install updates in Settings, then try again.', { cause });
  }
}
