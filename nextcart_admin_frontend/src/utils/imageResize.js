/**
 * Resizes an image file using a canvas, returning a new JPEG File.
 *
 * @param {File} file - Original image file
 * @param {number} maxWidth - Max output width in pixels
 * @param {number} maxHeight - Max output height in pixels
 * @param {number} quality - JPEG quality 0–1 (default 0.82)
 * @returns {Promise<File>}
 */
export function resizeImage(file, maxWidth, maxHeight, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1) // never upscale
      width  = Math.round(width  * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Canvas toBlob failed')); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for resizing'))
    }

    img.src = objectUrl
  })
}
