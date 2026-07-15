export const uploadService = {
    uploadImg,
}

async function uploadImg(fileOrEv) {
    const CLOUD_NAME = 'cuoeltac'
    const UPLOAD_PRESET = 'iceman'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const file = fileOrEv instanceof File
        ? fileOrEv
        : fileOrEv?.target?.files?.[0]

    if (!file) throw new Error('No file provided')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.error?.message || 'Upload failed')
    }
    return res.json()
}