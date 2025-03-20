'use server';

import { auth } from '@/lib/auth';
import { cleanupOrphanedUploads } from '../utils/cleanup-service';

/**
 * Clean up orphaned uploads for the current user
 * @returns Count of files cleaned up
 */
export async function cleanupMyOrphanedUploads(): Promise<{
  success: boolean;
  count: number;
  message: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        count: 0,
        message: 'You must be logged in to clean up your uploads'
      };
    }

    const count = await cleanupOrphanedUploads(userId);

    return {
      success: true,
      count,
      message:
        count > 0
          ? `Successfully cleaned up ${count} orphaned uploads`
          : 'No orphaned uploads found'
    };
  } catch (error) {
    console.error('Error cleaning up orphaned uploads:', error);
    return {
      success: false,
      count: 0,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Admin action to clean up orphaned uploads for a specific user
 * @param userId The user ID to clean up uploads for
 * @returns Count of files cleaned up
 */
export async function adminCleanupOrphanedUploads(
  userId: string
): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const session = await auth();
    const adminId = session?.user?.id;

    // Check admin permissions - in a real app, you would have proper role-based access control
    if (!adminId || adminId !== process.env.ADMIN_USER_ID) {
      return {
        success: false,
        count: 0,
        message: 'You do not have permission to perform this action'
      };
    }

    const count = await cleanupOrphanedUploads(userId);

    return {
      success: true,
      count,
      message:
        count > 0
          ? `Successfully cleaned up ${count} orphaned uploads for user ${userId}`
          : `No orphaned uploads found for user ${userId}`
    };
  } catch (error) {
    console.error('Error cleaning up orphaned uploads:', error);
    return {
      success: false,
      count: 0,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
