import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export interface UploadResult {
  success: boolean
  url?: string
  publicId?: string
  error?: string
}

export async function uploadImage(
  file: Buffer,
  folder: string = "sexta-empreendedor"
): Promise<UploadResult> {
  try {
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            resolve({ success: false, error: error.message })
          } else if (result) {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
            })
          } else {
            resolve({ success: false, error: "Upload failed" })
          }
        }
      )
      uploadStream.end(file)
    })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch {
    return false
  }
}

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

export function getImageUrl(publicId: string, options: {
  width?: number
  height?: number
  crop?: string
} = {}): string {
  const { width, height, crop } = options
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop: crop || "fill",
    fetch_format: "auto",
    quality: "auto",
  })
}