"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

import axiosClient from "@/services/axiosClient";

interface IUserContext {
    loading: boolean;

    createUserContext: (
        name: string,
        email: string,
        mobile: string,
        password: string,
    ) => Promise<any>;
}

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [loading, setLoading] = useState(false);

    // CREATE USER

    const createUserContext = async (
        name: string,
        email: string,
        mobile: string,
        password: string,
    ) => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/user/create-user",
                {
                    name,
                    email,
                    mobile,
                    password,
                },
            );

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                loading,
                createUserContext,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// CUSTOM HOOK

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser must be used inside UserProvider",
        );
    }

    return context;
};