import { supabase } from './supabase';

/**
 * Create storage bucket and policies for Philippines forms
 * Run this once to set up your storage infrastructure
 */
export async function createStorageBucket(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Creating storage bucket for Philippines forms...');

    // Create the bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('philippines-forms', {
      public: true, // Files are publicly accessible via URL
      fileSizeLimit: 10485760, // 10MB per file limit
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (bucketError) {
      // If bucket already exists, that's okay
      if (!bucketError.message.includes('already exists')) {
        throw bucketError;
      }
      console.log('Bucket already exists, continuing...');
    } else {
      console.log('Storage bucket created successfully:', bucketData);
    }

    console.log('Storage setup completed successfully!');
    return { success: true };

  } catch (error) {
    console.error('Error setting up storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test storage bucket by uploading a small test file
 */
export async function testStorageBucket(): Promise<{ success: boolean; error?: string }> {
  try {
    // Create a small test file
    const testContent = 'Test file for Philippines forms storage';
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
    const fileName = `test/test-${Date.now()}.txt`;

    // Upload test file
    const { data, error: uploadError } = await supabase.storage
      .from('philippines-forms')
      .upload(fileName, testFile);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('philippines-forms')
      .getPublicUrl(data.path);

    console.log('Test file uploaded successfully:', publicUrl);

    // Clean up test file
    await supabase.storage
      .from('philippines-forms')
      .remove([fileName]);

    console.log('Storage test completed successfully!');
    return { success: true };

  } catch (error) {
    console.error('Storage test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    };
  }
}

/**
 * Get storage bucket usage statistics
 */
export async function getStorageStats(): Promise<{
  success: boolean;
  totalFiles?: number;
  totalSize?: number;
  error?: string;
}> {
  try {
    // List all files in bucket
    const { data: files, error } = await supabase.storage
      .from('philippines-forms')
      .list('', {
        limit: 1000,
        offset: 0
      });

    if (error) throw error;

    const totalFiles = files?.length || 0;
    const totalSize = 0;

    // Note: Supabase doesn't provide file sizes in list() response
    // You'd need to call getMetadata for each file for exact sizes
    
    console.log(`Storage stats: ${totalFiles} files`);
    
    return {
      success: true,
      totalFiles,
      totalSize
    };

  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    };
  }
}

/**
 * Clean up expired session files (run this periodically)
 */
export async function cleanupExpiredFiles(): Promise<{ success: boolean; error?: string }> {
  try {
    // Get expired sessions from database
    const { data: expiredSessions, error: dbError } = await supabase
      .from('form_sessions')
      .select('session_token')
      .lt('expires_at', new Date().toISOString());

    if (dbError) throw dbError;

    if (!expiredSessions || expiredSessions.length === 0) {
      console.log('No expired sessions to clean up');
      return { success: true };
    }

    let cleanedFiles = 0;
    for (const session of expiredSessions) {
      try {
        // List files for this session
        const { data: files, error: listError } = await supabase.storage
          .from('philippines-forms')
          .list(session.session_token);

        if (listError || !files || files.length === 0) continue;

        // Delete all files for this session
        const filePaths = files.map(file => `${session.session_token}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('philippines-forms')
          .remove(filePaths);

        if (!deleteError) {
          cleanedFiles += files.length;
        }
      } catch (error) {
        console.error(`Error cleaning files for session ${session.session_token}:`, error);
      }
    }

    console.log(`Cleaned up ${cleanedFiles} expired files`);
    return { success: true };

  } catch (error) {
    console.error('Error during file cleanup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Cleanup failed'
    };
  }
}
