"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

import axiosClient from "@/services/axiosClient";

interface ILoginContext {
    loading: boolean;

    loginContext: (
        email: string,
        password: string,
    ) => Promise<any>;

    logoutContext: () => Promise<any>;
}

const LoginContext = createContext<ILoginContext | null>(
    null,
);

export const LoginProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [loading, setLoading] = useState(false);


    const loginContext = async (
        email: string,
        password: string,
    ) => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/auth/login",
                {
                    email,
                    password,
                },
            );

            localStorage.setItem(
                "accessToken",
                response.data.data.token,
            );

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };
    const logoutContext = async () => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/auth/logout",
            );

            localStorage.removeItem("accessToken");

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContext.Provider
            value={{
                loading,
                loginContext,
                logoutContext,
            }}
        >
            {children}
        </LoginContext.Provider>
    );
};


export const useLogin = () => {
    const context = useContext(LoginContext);

    if (!context) {
        throw new Error(
            "useLogin must be used inside LoginProvider",
        );
    }

    return context;
};