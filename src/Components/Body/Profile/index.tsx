import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import LoadingPage from "../../Error/LoadingPage";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nickname: "",
    firstName: "",
    familyName: "",
    dob: "",
    bio: "",
    location: "",
  });
  // State for API status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/profile/read/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const profile = data.profile;
        console.log(profile);
        setFormData({
          nickname: profile.nickname || "",
          firstName: profile.firstName || "",
          familyName: profile.lastName || "",
          dob: profile.dob || "",
          bio: profile.bio || "",
          location: profile.location || "",
        });
      } catch (error) {
        console.error("Error :", error);
        setError("error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
    console.log(formData);
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!formData.nickname.trim()) {
      setError("Display name is required");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/profile/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          nickname: formData.nickname,
          firstName: formData.firstName,
          lastName: formData.familyName,
          dob: formData.dob?.trim() ? formData.dob : null,
          bio: formData.bio,
          location: formData.location,
          userId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      setSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Error :", error);
      setError("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center pt-10 h-screen w-full">
        <LoadingPage />
      </div>
    );

  return (
    <div className="w-full py-2 px-6 rounded-lg">
      <div className="text-4xl font-bold mb-4">Public Profile</div>
      <div className="flex flex-col-reverse sm:flex-row w-full">
        <div className="w-full sm:w-[70%]">
          {isLoading && <p className="text-blue-600">Loading...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-md font-semibold text-gray-700"
              >
                Display Name *
              </label>
              <input
                id="nickName"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="firstName"
                className="block ttext-md font-semibold text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="familyName"
                className="block text-md font-semibold text-gray-700"
              >
                Family Name
              </label>
              <input
                id="familyName"
                name="familyName"
                type="text"
                value={formData.familyName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-md font-semibold text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob ? formData.dob.substring(0, 10) : ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border bg-gray-200 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-md font-semibold text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-md font-semibold text-gray-700"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div> ID: {id}</div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-[40%] py-1.5 sm:py-2 px-4 basic-button text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <div className="w-full">
          <ProfilePicture />
        </div>
      </div>
    </div>
  );
}
