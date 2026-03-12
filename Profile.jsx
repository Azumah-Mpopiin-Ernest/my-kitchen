import { useNavigate } from "react-router";
import profile from "./profile.png";
import { useState, useEffect, useRef } from "react";
export default function Profile() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("Description here...");
  const [name, setName] = useState("Name...");
  const [edit, setEdit] = useState(false);
  const [displayPopup, setDisplayPopup] = useState(false);

  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(profile);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const updateProfileImage = async (formData) => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (data?.data?.profilePic) {
        setProfileImage(data.data.profilePic);
      }

      alert("Updated");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const deleteProfileImage = async () => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: "" }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "something went wrong, please try again");
        return;
      }

      setProfileImage(profile);
      alert("Deleted");
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    const formData = new FormData();
    formData.append("image", file);

    await updateProfileImage(formData);

    // ✅ clean up the blob URL after upload
    URL.revokeObjectURL(previewUrl);
  };

  const fetchAccountData = async () => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setName(data.data.name);
      setDescription(data.data.description);

      if (data.data.profilePic) {
        setProfileImage(data.data.profilePic);
      }
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [API]);

  const updateProfile = async () => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong,please try again");
        return;
      }

      alert("Updated");
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "something went wrong, please try again");
        return;
      }

      alert("Deleted");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  const logOut = async () => {
    try {
      const res = await fetch(`${API}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        alert("Logout failed");
        return;
      }

      localStorage.removeItem("token");
      alert("You have been logged out");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Logout error:", err);
      alert("Network error");
    }
  };

  return (
    <main className="pt-40 pb-20">
      <nav className="fixed w-full z-10 top-0  px-5 py-10 shadow-md bg-white ">
        <div className="flex  justify-between">
          <h1 className="font-bold text-xl ">MyKitchen</h1>
          <button
            className="text-red-700 border-b hover:border-red-700 border-white text-lg cursor-pointer"
            onClick={() => setTimeout(() => navigate("/Home"), 1000)}
          >
            Home
          </button>
          <div className="bg-red-700 rounded-4xl w-8 h-8 flex justify-center items-center">
            <span
              className="material-symbols-outlined cursor-pointer text-yellow-200"
              onClick={() => setTimeout(() => navigate("/Profile"), 1000)}
            >
              person
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button
            className="text-red-700 cursor-pointer"
            onClick={() => logOut()}
          >
            logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center w-full border mt-10 px-4 py-10 gap-5 rounded max-w-[300px] md:max-w-[500px] shadow mx-auto">
        {/* Image Container */}
        <div className="relative group cursor-pointer">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Profile Image Display */}
          <img
            src={profileImage}
            alt="profile image"
            className="w-20 h-20 mb-5 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105"
            onClick={handleFileInputClick}
          />

          {/* Hover Overlay: Indicates the image can be changed */}
          <div
            onClick={handleFileInputClick}
            className="absolute inset-0 w-20 h-20 md:w-40 md:h-40 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="material-symbols-outlined text-white text-3xl">
              photo_camera
            </span>
          </div>

          {/* Delete Image Button: Only shows if the image isn't the default placeholder */}
          {profileImage !== profile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteProfileImage();
              }}
              className="absolute top-0 right-0 bg-yellow-200 text-red-700 rounded-full flex justify-center items-center cursor-pointer  shadow-md hover:bg-yellow-300 transition-colors"
              title="Remove photo"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <input
          type="text"
          value={name}
          className="text-center font-bold w-full"
          disabled={!edit}
          maxLength={25}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          name="description"
          id="description"
          className="mb-10 bg-white px-2 w-full resize-none text-center"
          onChange={(e) => setDescription(e.target.value)}
          disabled={!edit}
          rows={5}
          maxLength={100}
          value={description}
        ></textarea>

        <div className="flex justify-between items-center w-full bg-yellow-200 rounded p-1 relative">
          <span
            className="material-symbols-outlined text-gray-700 cursor-pointer"
            onClick={() => {
              if (edit) {
                updateProfile();
                setEdit(false);
              } else {
                setEdit(true);
              }
            }}
          >
            {edit ? "check" : "edit"}
          </span>
          <button
            className="text-red-700 px-5 rounded-xl py-1 cursor-pointer"
            onClick={() => setDisplayPopup(true)}
          >
            Delete account
          </button>

          {displayPopup && (
            <div className="absolute bg-yellow-200 w-full rounded-xl p-4 bottom-16 shadow-2xl border border-yellow-300 animate-popup z-20">
              <p className="text-red-700">
                <span className="font-bold">NB:</span> This action will erase
                all data related to this account.
              </p>

              <div className="flex justify-between items-center mt-5">
                <button
                  className="bg-red-700 px-5 py-1 cursor-pointer hover:bg-red-800 transition-colors rounded text-yellow-200 font-semibold"
                  onClick={() => deleteAccount()}
                >
                  Delete Account
                </button>
                <button
                  className="bg-white px-2 py-1 rounded cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-200"
                  onClick={() => setDisplayPopup(false)}
                >
                  Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
