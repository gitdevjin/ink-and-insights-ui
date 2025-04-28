import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "../../../util/crop"; // Utility function for cropping
import { FaPencilAlt } from "react-icons/fa";
import { useUser } from "../../../hooks/use-user";
const API_URL = import.meta.env.VITE_API_URL;

const ProfilePicture: React.FC = () => {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState<File | null>(null); // Selected file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Final preview URL
  const [imageSrc, setImageSrc] = useState<string | null>(null); // Source for cropping
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing profile image
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/profile/get/imageUrl/${user?.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        if (data.profile_image) {
          setImagePreview(data.profile_image);
        }
      } catch (err) {
        console.log("error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle image input changes
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a JPEG, PNG, or GIF image");
        return;
      }
      // Validate file size (< 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      setImageSrc(URL.createObjectURL(file));
      setIsCropping(true); // Open cropping modal
    }
  };

  // Clean up URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (imagePreview && profileImage) URL.revokeObjectURL(imagePreview);
    };
  }, [imageSrc, imagePreview, profileImage]);

  // Update cropped area
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    }, // underscore `_` means this parameter is required by the function signature, but I’m intentionally not using it.
    []
  );

  // Crop and save image
  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setProfileImage(croppedImage);
      setImagePreview(URL.createObjectURL(croppedImage));
      setIsCropping(false);
      setImageSrc(null); // Clear cropping source
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Upload cropped image
  const handleUpload = async () => {
    if (!profileImage) {
      setError("No image selected");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("profile_image", profileImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const data = await response.json();
      setSuccess("Profile image updated successfully");
      setImagePreview(data.profile_image); // Update with server URL
      setProfileImage(null); // Clear file
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto sm:px-4 my-4 sm:my-0">
      {isLoading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <label className="block text-lg font-semibold text-gray-700">
        Profile Image
      </label>
      <div className="relative mb-4">
        <img
          src={imagePreview || "/public/profile.png"}
          alt="Profile preview"
          className="mt-2 w-52 h-52 rounded-full object-cover border border-gray-300"
        />
        <label
          htmlFor="imageUpload"
          className="absolute bottom-0 left-2 flex flex-row justify-center items-center w-[17%] cursor-pointer bg-gray-200 hover:bg-blue-100 file:mr-4 py-1.5 px-1 rounded-md text-md text-center"
        >
          <FaPencilAlt className="" />
          <span> &nbsp; edit </span>
        </label>
      </div>
      <input
        id="imageUpload"
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleImageChange}
        className="hidden"
        aria-label="Upload profile image"
      />
      <button
        onClick={handleUpload}
        disabled={isLoading || !profileImage}
        className={`mt-2 py-1 sm:py-2 px-4 w-[40%] sm:w-[30%] basic-button text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isLoading || !profileImage ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>

      {/* Custom Tailwind Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div id="cropper" className="relative h-72">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  minZoom={0.5}
                  restrictPosition={false}
                  onCropComplete={onCropComplete}
                  style={{ containerStyle: { width: "100%", height: "100%" } }}
                />
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsCropping(false)}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="py-2 px-4 basic-button text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
