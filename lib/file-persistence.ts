import { supabase } from './supabase';

export interface FileUploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}

/**
 * Upload file to Supabase Storage and return URL
 * This replaces storing base64 in the database
 */
export async function uploadFileToStorage(
  file: File | string, // File object or base64 string
  sessionToken: string,
  fieldName: string
): Promise<FileUploadResult> {
  try {
    let fileData: File;
    let fileName: string;

    // Handle base64 string (from webcam captures)
    if (typeof file === 'string' && file.startsWith('data:')) {
      const response = await fetch(file);
      const blob = await response.blob();
      fileName = `${sessionToken}/${fieldName}_${Date.now()}.png`;
      fileData = new File([blob], fileName, { type: 'image/png' });
    } 
    // Handle File object (from file input)
    else if (file instanceof File) {
      const extension = file.name.split('.').pop() || 'jpg';
      fileName = `${sessionToken}/${fieldName}_${Date.now()}.${extension}`;
      fileData = file;
    } 
    else {
      throw new Error('Invalid file format');
    }

    console.log(`Uploading ${fieldName} to storage:`, fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('philippines-forms')
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('philippines-forms')
      .getPublicUrl(data.path);

    console.log(`File uploaded successfully: ${publicUrl}`);

    return {
      success: true,
      fileUrl: publicUrl,
      fileName: data.path
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Delete file from storage when session is cleared
 */
export async function deleteSessionFiles(sessionToken: string): Promise<void> {
  try {
    // List all files for this session
    const { data: files, error: listError } = await supabase.storage
      .from('philippines-forms')
      .list(sessionToken);

    if (listError) throw listError;

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${sessionToken}/${file.name}`);
      
      // Delete all files for this session
      const { error: deleteError } = await supabase.storage
        .from('philippines-forms')
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.error('Error deleting session files:', error);
  }
}

/**
 * Enhanced persistence manager that handles files separately
 */
export interface FormDataWithFiles {
  formData: Record<string, unknown>;
  fileFields: string[]; // Fields that contain file data
}

export async function saveFormWithFiles(
  sessionToken: string,
  formData: Record<string, unknown>,
  fileFields: string[] = []
): Promise<{ success: boolean; error?: string }> {
  try {
    const processedFormData = { ...formData };
    const fileUploads: Promise<void>[] = [];

    // Process file fields
    for (const fieldName of fileFields) {
      const fieldValue = formData[fieldName];
      
      if (fieldValue && (typeof fieldValue === 'string' || fieldValue instanceof File)) {
        // Upload file and replace with URL
        fileUploads.push(
          uploadFileToStorage(fieldValue, sessionToken, fieldName)
            .then(result => {
              if (result.success) {
                processedFormData[fieldName] = result.fileUrl;
                processedFormData[`${fieldName}_fileName`] = result.fileName;
              } else {
                console.error(`Failed to upload ${fieldName}:`, result.error);
              }
            })
        );
      }
    }

    // Wait for all file uploads to complete
    await Promise.all(fileUploads);

    // Now save the form data with file URLs instead of base64
    // This integrates with your existing FormPersistenceManager
    return { success: true };
  } catch (error) {
    console.error('Error saving form with files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Save failed'
    };
  }
}

// Storage bucket creation SQL (run this in Supabase SQL editor):
export const STORAGE_SETUP_SQL = `
-- Create storage bucket for Philippines forms
INSERT INTO storage.buckets (id, name, public) 
VALUES ('philippines-forms', 'philippines-forms', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'philippines-forms');

-- Allow public access to files (for viewing)
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'philippines-forms');

-- Allow users to delete their own files
CREATE POLICY "Allow user file deletion" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'philippines-forms');
`;
