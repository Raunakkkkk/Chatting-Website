import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const ProfileModal = ({
  user,
  children,
  isOpen: controlledIsOpen,
  onClose,
  isCurrentUser = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const handleOpen = () => {
    if (controlledIsOpen === undefined) setInternalOpen(true);
  };
  const handleClose = () => {
    if (onClose) onClose();
    if (controlledIsOpen === undefined) setInternalOpen(false);
    setEditMode(false);
    setError("");
  };

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pic, setPic] = useState(user.pic || "");
  const [picLoading, setPicLoading] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
    setName(user.name);
    setEmail(user.email);
    setPic(user.pic || "");
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(user.name);
    setEmail(user.email);
    setPic(user.pic || "");
    setError("");
    setSuccess("");
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      setError("Please select an image!");
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dcpeil22z");
      fetch("https://api.cloudinary.com/v1_1/dcpeil22z/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          setError("Image upload failed");
          setPicLoading(false);
        });
    } else {
      setError("Please select a JPEG or PNG image!");
      setPicLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/profile",
        { name, email, pic },
        config
      );
      setEditMode(false);
      setSuccess("Profile updated successfully!");
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children && <span onClick={handleOpen}>{children}</span>}

      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
                  {editMode ? "Edit Profile" : "Profile"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editMode
                    ? "Update your profile information"
                    : "View profile details"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-4 ring-blue-200 dark:ring-blue-700 shadow-lg">
                  {user.pic ? (
                    <img
                      src={user.pic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {editMode && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <FaCamera className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {editMode && (
                <div className="w-full max-w-xs">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-gray-700 dark:text-gray-300">
                      Profile Photo
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                    className="file-input file-input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 file:bg-blue-500 file:border-blue-500 file:text-white hover:file:bg-blue-600"
                    disabled={picLoading}
                  />
                  {picLoading && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Uploading...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Fields */}
            {editMode ? (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FaUser className="w-4 h-4 mr-2" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaUser className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white ml-7">
                    {user.name}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaEnvelope className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white ml-7">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <div className="alert alert-error bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <svg
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <svg
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-700 dark:text-green-400">
                  {success}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-action flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              isCurrentUser && (
                <button onClick={handleEdit} className="btn btn-primary">
                  <FaEdit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ProfileModal;
