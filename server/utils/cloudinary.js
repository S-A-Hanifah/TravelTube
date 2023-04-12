import cloudinary from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_PRIV,
});

export const deleteSource = async (file, type) => {
  const source = extractPublicId(file, type);

  await cloudinary.api.delete_resources(
    source,
    function (result) {
      console.log(result.deleted_counts);
    },
    { resource_type: type }
  );
};
