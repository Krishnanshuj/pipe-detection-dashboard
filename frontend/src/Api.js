export const uploadImage = async (file, confidence) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("conf_threshold", confidence); 

  const response = await fetch("https://pipe-detection-dashboard.onrender.com/process_image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload image: ${errorText}`);
  }

  return await response.json();
};
