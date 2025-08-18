export const uploadImage = async (file, confidence) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("conf_threshold", confidence); 

  const response = await fetch("https://pipe-detection-dashboard.onrender.com/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return await response.json();
};
