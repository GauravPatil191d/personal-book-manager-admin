"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

import axiosClient from "@/services/axiosClient";

interface IBooksContext {
    loading: boolean;

    createBookContext: (data: FormData) => Promise<any>;

    getAllBooksContext: () => Promise<any>;

    getBookByIdContext: (
        book_generated_id: string,
    ) => Promise<any>;

    updateBookContext: (data: FormData) => Promise<any>;

    deleteBookContext: (
        book_generated_id: string,
    ) => Promise<any>;
}

const BooksContext = createContext<IBooksContext | null>(
    null,
);

export const BooksProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [loading, setLoading] = useState(false);


    const createBookContext = async (
        data: FormData,
    ) => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/books/create-book",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };


    const getAllBooksContext = async () => {
        try {
            setLoading(true);

            const response = await axiosClient.get(
                "/books/get-all-books",
            );

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };


    const getBookByIdContext = async (
        book_generated_id: string,
    ) => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/books/get-book-by-id",
                {
                    book_generated_id,
                },
            );

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };


    const updateBookContext = async (
        data: FormData,
    ) => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/books/update-book",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        } finally {
            setLoading(false);
        }
    };

    const deleteBookContext = async (
        book_generated_id: string,
    ) => {
        try {
            setLoading(true);

            const response = await axiosClient.post(
                "/books/delete-book",
                {
                    book_generated_id,
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
        <BooksContext.Provider
            value={{
                loading,
                createBookContext,
                getAllBooksContext,
                getBookByIdContext,
                updateBookContext,
                deleteBookContext,
            }}
        >
            {children}
        </BooksContext.Provider>
    );
};

export const useBooks = () => {
    const context = useContext(BooksContext);

    if (!context) {
        throw new Error(
            "useBooks must be used inside BooksProvider",
        );
    }

    return context;
};