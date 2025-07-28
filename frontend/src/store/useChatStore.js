import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create ((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSending: false,
    searchResults: [],
    isSelectedUserAI: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try{
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data.contacts });
        }
        catch(error){
            toast.error(error.response?.data?.message || "Internal Error")
        }
        finally{
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        }
        catch(error){
            toast.error(error.response?.data?.message);
        }
        finally{
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        set({isSending: true});
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages: [...messages, res.data]})
        }
        catch(error){
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
        finally{
            set({isSending: false});
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser)
            return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) 
                return;

            set({messages: [...get().messages, newMessage],})
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    searchResults: [],

    searchUsers: async (query) => {
        try {
            const res = await axiosInstance.get(`/users/search?query=${query}`);
            set({ searchResults: res.data });
        } 
        catch (error) {
            toast.error(error.response?.data?.message || "Search failed");
            set({ searchResults: [] });
        }
    },


    addContact: async (userId) => {
        try { 
            const res = await axiosInstance.post("/users/add", { userId });
            if(res.data.success) {
                toast.success("Contact added successfully");
                get().getUsers();
            }
            return true;
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Failed to add contact");
            return false;
        }
    },

    deleteContact: async (contactId) => {
        try {
            const res = await axiosInstance.delete(`/users/remove/${contactId}`);
            if(res.data.message === "Contact removed") {
                toast.success("Contact removed successfully");
                get().getUsers();
            }
        }       
        catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove contact");
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser}),
}))