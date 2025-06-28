import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import UserBadgeItem from "./../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { toast } from "react-hot-toast";
import {
  FaUsers,
  FaCrown,
  FaSignOutAlt,
  FaEdit,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa";

const UpdateGroupChatModel = ({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, selectedChat, setselectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [transferAdminLoading, setTransferAdminLoading] = useState(false);
  const [showTransferAdmin, setShowTransferAdmin] = useState(false);
  const [adminTransferred, setAdminTransferred] = useState(false);

  // Check if current user is admin
  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      toast.success("Group name updated successfully!");
    } catch (error) {
      toast.error(
        `Error: ${
          error.response?.data?.message || "Failed to update group name"
        }`
      );
      setRenameLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setselectedChat() : setselectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error(
        `Error: ${error.response?.data?.message || "Failed to remove user"}`
      );
      setLoading(false);
    }
  };

  const handleTransferAdmin = async (newAdmin) => {
    try {
      setTransferAdminLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadmin`,
        {
          chatId: selectedChat._id,
          userId: newAdmin._id,
        },
        config
      );

      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setTransferAdminLoading(false);
      setShowTransferAdmin(false);
      setAdminTransferred(true);
      toast.success(
        `Admin rights transferred to ${newAdmin.name}. You can now leave the group.`
      );
    } catch (error) {
      toast.error(
        `Error: ${
          error.response?.data?.message || "Failed to transfer admin rights"
        }`
      );
      setTransferAdminLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    // Step 1: If admin with other members, show transfer section
    if (isAdmin && selectedChat.users.length > 1 && !showTransferAdmin) {
      setShowTransferAdmin(true);
      return;
    }

    // Step 2: Actually leave the group
    try {
      setLeaveLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );

      setselectedChat();
      setFetchAgain(!fetchAgain);
      setLeaveLoading(false);
      setIsOpen(false);
      toast.success("You have left the group");
    } catch (error) {
      toast.error(
        `Error: ${error.response?.data?.message || "Failed to leave group"}`
      );
      setLeaveLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      toast.error(
        `Error: ${error.response?.data?.message || "Failed to add user"}`
      );
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load search results");
    }
  };

  return (
    <>
      {children ? (
        <div onClick={() => setIsOpen(true)}>{children}</div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Update Group"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      )}

      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
              {isAdmin ? "Manage Group" : "Group Info"}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Group Info Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6 border border-blue-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedChat.chatName}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>{selectedChat.users.length}</strong> members
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FaCrown className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Admin: <strong>{selectedChat.groupAdmin.name}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Admin Only: Rename Group */}
            {isAdmin && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 flex items-center space-x-2">
                  <FaEdit className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span>Rename Group</span>
                </h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter new group name..."
                    className="input input-bordered flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <button
                    onClick={handleRename}
                    disabled={renameloading || !groupChatName}
                    className="btn btn-primary min-w-[100px]"
                  >
                    {renameloading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Current Members */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 flex items-center space-x-2">
                <FaUsers className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span>Current Members ({selectedChat.users.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                    showRemove={isAdmin}
                  />
                ))}
              </div>
            </div>

            {/* Admin Only: Add Users */}
            {isAdmin && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 flex items-center space-x-2">
                  <FaUserPlus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span>Add New Members</span>
                </h4>
                <input
                  type="text"
                  placeholder="Search users to add..."
                  className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />

                {search && (
                  <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {loading ? (
                      <div className="flex justify-center p-4">
                        <span className="loading loading-spinner loading-md text-blue-500"></span>
                      </div>
                    ) : searchResult.length > 0 ? (
                      searchResult
                        .filter(
                          (user) =>
                            !selectedChat.users.find((u) => u._id === user._id)
                        )
                        .map((user) => (
                          <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleAddUser(user)}
                          />
                        ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Admin Only: Transfer Admin Rights */}
            {isAdmin && selectedChat.users.length > 1 && showTransferAdmin && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span>Transfer Admin Rights</span>
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Select a member to transfer admin rights to before leaving:
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  {selectedChat.users
                    .filter((u) => u._id !== user._id) // Exclude current admin
                    .map((u) => (
                      <button
                        key={u._id}
                        onClick={() => handleTransferAdmin(u)}
                        disabled={transferAdminLoading}
                        className="inline-flex items-center px-3 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium cursor-pointer hover:from-yellow-200 hover:to-orange-200 dark:hover:from-yellow-800 dark:hover:to-orange-800 transition-all duration-200 shadow-sm border border-yellow-200 dark:border-yellow-700"
                      >
                        <span>{u.name}</span>
                        {transferAdminLoading && (
                          <span className="loading loading-spinner loading-xs ml-2"></span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Leave Group Button */}
            <button
              onClick={handleLeaveGroup}
              disabled={
                leaveLoading ||
                (isAdmin &&
                  selectedChat.users.length > 1 &&
                  showTransferAdmin &&
                  !adminTransferred)
              }
              className={`btn btn-outline w-full flex items-center justify-center space-x-2 ${
                isAdmin && selectedChat.users.length > 1 && !showTransferAdmin
                  ? "btn-warning"
                  : "btn-error"
              }`}
            >
              {leaveLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>
                    {isAdmin &&
                    selectedChat.users.length > 1 &&
                    !showTransferAdmin
                      ? "Leave Group"
                      : isAdmin &&
                        selectedChat.users.length > 1 &&
                        showTransferAdmin &&
                        !adminTransferred
                      ? "Transfer Admin Rights First"
                      : "Confirm Leave"}
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="modal-action mt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default UpdateGroupChatModel;
