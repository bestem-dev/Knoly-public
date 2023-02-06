export async function compressAndCropImageFile(imgFileToCompress: File, size: number, quality: number) {
  // showing the compressed image
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  const blob = new Blob([await imgFileToCompress.arrayBuffer()])
  const blobURL = window.URL.createObjectURL(blob)
  const image = new Image();
  image.src = blobURL;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      let xoffset = 0
      let yoffset = 0
      const originalSize = Math.min(image.width, image.height)
      if (image.width > image.height){
        xoffset = (image.width - image.height) / 2
      }
      else {
        yoffset = (image.height - image.width) / 2
      }

      context!.drawImage(
        image,
        // source coord
        xoffset, yoffset, originalSize, originalSize,
        // draw coords
        0, 0, size, size
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], imgFileToCompress.name, {type: blob.type}))
          }
        },
        "image/jpeg",
        quality
      );

    }
  })
}
