import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { CirclePlus, UserRoundMinus, Users, } from 'lucide-react';
import placeholderProfilePic from "../assets/placeholderProfilePic.jpg"
import { useAuthStore } from '../store/useAuthStore';
import { UserPlus, XCircle } from 'phosphor-react';

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUserLoading, searchResults, searchUsers, addContact, deleteContact } = useChatStore();
    
    const [hasSearched, setHasSearched] = useState(false);

    const[query, setQuery] = useState("");
    const handleSearch = (e) => {
        if(query.trim() === "") {
            searchUsers("");
        }
    };

    const { onlineUsers } = useAuthStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers()
    },
    [getUsers])

    const [showAddFriendModal, setShowAddFriendModal] = useState(false);

    const [contactsQuery, setContactsQuery] = useState("");

    const filteredUsers = users
    .filter((user) =>
        user.fullName.toLowerCase().includes(contactsQuery.toLowerCase())
    )
    .filter((user) =>
        showOnlineOnly ? onlineUsers.includes(user._id) : true
    );


    if(isUserLoading) return <SidebarSkeleton />

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="flex items-center justify-between border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>

                <button onClick={() => {
                        setQuery("");
                        useChatStore.setState({ searchResults: [] });
                        setShowAddFriendModal(true);
                    }}
                    className="btn btn-sm btn-ghost"
                >
                    <UserPlus className="size-7" />
                </button>
            </div>
            <div className="mt-3 hidden lg:flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox checkbox-sm"
                    />
                    <span className="text-sm">Show online only</span>
                </label>
                <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> 
            </div> 

            <div className="mt-3 hidden lg:block">
                <input
                    value={contactsQuery}
                    onChange={(e) => setContactsQuery(e.target.value)}
                    placeholder="Search contacts..."
                    className="input input-bordered w-full"
                />
            </div>


            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center hover:bg-base-200 transition-colors ${
                            selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : "bg-base-100"
                        }`}
                    >
                        <div className="flex items-center w-full justify-between">
                            {/* LEFT side: Avatar + Name/Status */}
                            <div className="flex items-center gap-3 overflow-hidden flex-grow">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={user.profilePic || placeholderProfilePic}
                                        alt={user.name}
                                        className="size-12 object-cover rounded-full"
                                    />
                                    {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                    )}
                                </div>

                                <div className="flex flex-col items-start text-left w-full overflow-hidden">
                                    <div className="font-medium truncate w-full">{user.fullName}</div>
                                    <div className="text-sm text-zinc-100 w-full truncate">
                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT side: Remove icon */}
                            <button
                                className="hidden lg:flex btn btn-ghost btn-xs p-1 ml-2 flex-shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const confirmDelete = window.confirm("Are you sure you want to remove this contact?");
                                    if(confirmDelete){
                                        deleteContact(user._id);
                                        if (selectedUser?._id === user._id) {
                                            setSelectedUser(null);
                                        }
                                    }
                                }}
                            >
                                <UserRoundMinus className="size-6 text-red-500" />
                            </button>
                        </div>
                    </button>

                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>

            {showAddFriendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative pt-9 w-full max-w-2xl mx-auto bg-base-100 p-6 rounded shadow-lg border border-base-300">
                    {/* Close icon top-right */}
                        <button
                            onClick={() => setShowAddFriendModal(false)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        >
                            <XCircle className="size-6" />
                        </button>

                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users to add..."
                            className="input input-bordered w-full mb-4"
                        />
                        <button
                            onClick={() => {
                                setHasSearched(true);
                                searchUsers(query);
                            }}
                            className="btn btn-primary btn-sm w-full mb-2"
                        >
                            Search
                        </button>

                        <ul className="space-y-1 max-h-60 overflow-y-auto">
                            {hasSearched && searchResults.length === 0 ? (
                                <li className="text-center text-zinc-500 py-4">
                                    No users found
                                </li>
                            ) : (
                                searchResults.map((user) => (
                                    <li
                                        key={user._id}
                                        className="flex justify-between items-center bg-base-200 px-3 py-2 rounded"
                                    >
                                        <span>{user.fullName}</span>
                                        <button
                                        className="btn btn-xs btn-accent"
                                        onClick={async () => {
                                            const addSuccess = await addContact(user._id);
                                            if (addSuccess) {
                                                setShowAddFriendModal(false);
                                            }
                                        }}
                                        >
                                            <CirclePlus className="size-4" />
                                        </button>
                                    </li>
                                )
                            ))}
                    </ul>
                </div>
            </div>
        )}

        </aside>
    )
}

export default Sidebar