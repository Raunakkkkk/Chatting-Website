import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { toast } from "react-hot-toast";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

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
      toast.error("Failed to load the Search results");
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.error("Please fill all the fields and add at least one user");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
      toast.success("New Group Chat Created");
    } catch (error) {
      toast.error("Failed to create Group chat");
    }
  };

  const handleGroup = (usertoadd) => {
    if (selectedUsers.find((u) => u._id === usertoadd._id)) {
      toast.error("User already added!");
      return;
    }
    setSelectedUsers([...selectedUsers, usertoadd]);
    setSearch("");
    setSearchResult([]);
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
              Create Group Chat
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Group Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Group Name
              </label>
              <input
                type="text"
                placeholder="Enter group name..."
                className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </div>

            {/* Search Users */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Users
              </label>
              <input
                type="text"
                placeholder="Search users to add..."
                className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Users ({selectedUsers.length})
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {search && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search Results
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg">
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <span className="loading loading-spinner loading-md text-blue-500"></span>
                    </div>
                  ) : searchResult.length > 0 ? (
                    searchResult
                      .filter(
                        (user) => !selectedUsers.find((u) => u._id === user._id)
                      )
                      .map((user) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => handleGroup(user)}
                        />
                      ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-action mt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={!groupChatName || selectedUsers.length === 0}
            >
              Create Group
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

export default GroupChatModal;
