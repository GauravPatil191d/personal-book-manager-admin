import { Book } from "@/types/book";

export const INITIAL_BOOKS: Book[] = [
  {
    _id: {
      $oid: "6a7280fdd740579391c3b838",
    },
    book_generated_id: "591011ce-6368-4ae6-811e-f3cf2a6f05c2",
    user_generated_id: "4e4c957d-d5ac-4e4b-87f7-392d324c5e00",
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy & proven way to build good habits & break bad ones. One of the best habit books.",
    cover_image: "/uploads/books/1785889021637-The-One-Book-That-Rewired-How-I-Think-About-Success.jpg",
    notes: "Read Chapter 1 today. Amazing concepts on identity-based habits.",
    tags: ["Self Help", "Productivity", "Habits"],
    status: "Reading",
    created_at: {
      $date: "2026-08-05T00:17:01.641Z",
    },
    updated_at: {
      $date: "2026-08-05T00:17:01.641Z",
    },
    rating: 5,
    progressPages: 140,
    totalPages: 320,
  },
  {
    _id: {
      $oid: "6a7280fdd740579391c3b839",
    },
    book_generated_id: "721011ce-8868-4ae6-811e-f3cf2a6f0999",
    user_generated_id: "4e4c957d-d5ac-4e4b-87f7-392d324c5e00",
    title: "Deep Work",
    author: "Cal Newport",
    description: "Rules for focused success in a distracted world.",
    cover_image: "",
    notes: "Focusing deeply for 4 hours daily is the ultimate superpower.",
    tags: ["Productivity", "Focus", "Self Help"],
    status: "Completed",
    created_at: {
      $date: "2026-07-20T10:00:00.000Z",
    },
    updated_at: {
      $date: "2026-08-01T14:30:00.000Z",
    },
    rating: 5,
    progressPages: 304,
    totalPages: 304,
  },
  {
    _id: {
      $oid: "6a7280fdd740579391c3b840",
    },
    book_generated_id: "831011ce-9968-4ae6-811e-f3cf2a6f0888",
    user_generated_id: "4e4c957d-d5ac-4e4b-87f7-392d324c5e00",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness.",
    cover_image: "",
    notes: "Wealth is what you don't see. Freedom is the highest dividend.",
    tags: ["Finance", "Psychology", "Self Help"],
    status: "Reading",
    created_at: {
      $date: "2026-08-02T11:20:00.000Z",
    },
    updated_at: {
      $date: "2026-08-04T18:12:00.000Z",
    },
    rating: 4.5,
    progressPages: 95,
    totalPages: 256,
  },
  {
    _id: {
      $oid: "6a7280fdd740579391c3b841",
    },
    book_generated_id: "941011ce-1168-4ae6-811e-f3cf2a6f0777",
    user_generated_id: "4e4c957d-d5ac-4e4b-87f7-392d324c5e00",
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A Handbook of Agile Software Craftsmanship.",
    cover_image: "",
    notes: "Leave the codebase cleaner than you found it. Meaningful names matter.",
    tags: ["Tech", "Programming", "Architecture"],
    status: "Completed",
    created_at: {
      $date: "2026-06-15T09:00:00.000Z",
    },
    updated_at: {
      $date: "2026-07-10T16:45:00.000Z",
    },
    rating: 5,
    progressPages: 464,
    totalPages: 464,
  },
  {
    _id: {
      $oid: "6a7280fdd740579391c3b842",
    },
    book_generated_id: "151011ce-2268-4ae6-811e-f3cf2a6f0666",
    user_generated_id: "4e4c957d-d5ac-4e4b-87f7-392d324c5e00",
    title: "Dune",
    author: "Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides.",
    cover_image: "",
    notes: "Plan to start reading next month.",
    tags: ["Fiction", "Sci-Fi", "Classic"],
    status: "Plan to Read",
    created_at: {
      $date: "2026-08-04T12:00:00.000Z",
    },
    updated_at: {
      $date: "2026-08-04T12:00:00.000Z",
    },
    rating: 0,
    progressPages: 0,
    totalPages: 688,
  },
  {
    _id: {
      $oid: "6a7280fdd740579391c3b843",
    },
    book_generated_id: "261011ce-3368-4ae6-811e-f3cf2a6f0555",
    user_generated_id: "4e4c957d-d5ac-4e4b-87f7-392d324c5e00",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "Explores the two systems that drive the way we think.",
    cover_image: "",
    notes: "System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative.",
    tags: ["Psychology", "Self Help", "Cognition"],
    status: "Plan to Read",
    created_at: {
      $date: "2026-08-05T08:00:00.000Z",
    },
    updated_at: {
      $date: "2026-08-05T08:00:00.000Z",
    },
    rating: 0,
    progressPages: 0,
    totalPages: 499,
  }
];
