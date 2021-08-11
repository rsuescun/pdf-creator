export async function embedImage(url, pdfDoc) {
  if (!url) return null
  const ext = url.split('.').pop()
  const embedActions = { jpg: 'embedJpg', jpeg: 'embedJpg', png: 'embedPng' }
  const imageBytes = await fetch(url, { cache: 'no-cache' }).then(res => res.arrayBuffer())
  return new Promise(resolve => {
    pdfDoc[embedActions[ext]](imageBytes)
      .then(image => resolve(image))
      .catch(() => resolve(pdfDoc.embedPng(imageBytes)))
  })
}

export function downloadPdf(body) {
  const blob = new Blob([body], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
