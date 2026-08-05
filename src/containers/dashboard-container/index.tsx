"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Book, BookStatus } from "@/types/book";
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";
import { useBooks } from "@/context/book-context";
import "./style.css";

const getImageUrl = (coverPath: string) => {
  if (!coverPath) return "";
  if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
    return coverPath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:8000";
  return `${baseUrl}${coverPath.startsWith("/") ? "" : "/"}${coverPath}`;
};

export const DashboardContainer: React.FC = () => {
  const router = useRouter();
  const {
    getAllBooksContext,
    createBookContext,
    updateBookContext,
    deleteBookContext,
    loading: apiLoading,
  } = useBooks();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [libraryTab, setLibraryTab] = useState<"All Books" | "Completed" | "Reading" | "Pending">("All Books");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Modals & State
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingNotes, setEditingNotes] = useState<string>("");
  const [isEditingNotesModal, setIsEditingNotesModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  // Form State for Adding New Book
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newStatus, setNewStatus] = useState<BookStatus>("Reading");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  // Check auth & fetch books on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.replace("/login");
        return;
      }
    }
    fetchBooks();
  }, [router]);

  const fetchBooks = async () => {
    try {
      const res = await getAllBooksContext();
      const fetched = Array.isArray(res)
        ? res
        : res?.books || res?.data || res?.booksList || [];
      if (Array.isArray(fetched)) {
        setBooks((prevBooks) => {
          return fetched.map((fBook: any) => {
            const prev = prevBooks.find(
              (p) =>
                p.book_generated_id === fBook.book_generated_id ||
                (p._id?.$oid && fBook._id?.$oid && p._id.$oid === fBook._id.$oid)
            );
            return {
              ...fBook,
              cover_image: fBook.cover_image || (prev ? prev.cover_image : ""),
            };
          });
        });
      }
    } catch (err) {
      console.log("Could not fetch backend books", err);
    }
  };

  // Extract unique available tags for tag filter
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      if (Array.isArray(book.tags)) {
        book.tags.forEach((t) => t && set.add(t.trim()));
      } else if (typeof book.tags === "string" && book.tags) {
        (book.tags as string).split(",").forEach((t) => t && set.add(t.trim()));
      }
    });
    return Array.from(set).filter(Boolean);
  }, [books]);

  // Stats Calculations
  const totalBooksCount = books.length;
  const booksReadCount = books.filter((b) => b.status === "Completed").length;
  const booksReadingCount = books.filter((b) => b.status === "Reading").length;
  const booksPendingCount = books.filter(
    (b) => (b.status as string) === "Plan to Read" || (b.status as string) === "Pending"
  ).length;
  const recentlyAddedBooks = useMemo(() => {
    return [...books].slice(0, 3);
  }, [books]);

  // Filter books based on search query, selected status tab (All Books, Completed, Reading, Pending), and selected tag
  const filteredBooks = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    return books.filter((book) => {
      const tagsList = Array.isArray(book.tags)
        ? book.tags
        : typeof book.tags === "string"
        ? (book.tags as string).split(",").map((t) => t.trim())
        : [];

      const matchesSearch =
        searchLower === "" ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        (book.description && book.description.toLowerCase().includes(searchLower)) ||
        (book.notes && book.notes.toLowerCase().includes(searchLower)) ||
        tagsList.some((t) => t.toLowerCase().includes(searchLower));

      let matchesTab = true;
      if (libraryTab === "Completed") {
        matchesTab = book.status === "Completed";
      } else if (libraryTab === "Reading") {
        matchesTab = book.status === "Reading";
      } else if (libraryTab === "Pending") {
        matchesTab = (book.status as string) === "Plan to Read" || (book.status as string) === "Pending";
      }

      let matchesTag = true;
      if (selectedTag !== "All") {
        matchesTag = tagsList.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
      }

      return matchesSearch && matchesTab && matchesTag;
    });
  }, [books, searchQuery, libraryTab, selectedTag]);

  // Handlers
  const handleOpenDetailModal = (book: Book) => {
    setSelectedBook(book);
    setEditingNotes(book.notes || "");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview("");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBook) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("book_generated_id", selectedBook.book_generated_id);
      formData.append("notes", editingNotes);
      formData.append("title", selectedBook.title);
      formData.append("author", selectedBook.author);
      formData.append("status", selectedBook.status);
      formData.append("description", selectedBook.description || "");
      if (selectedBook.cover_image) {
        formData.append("cover_image", selectedBook.cover_image);
      }
      if (Array.isArray(selectedBook.tags)) {
        formData.append("tags", selectedBook.tags.join(", "));
      } else if (typeof selectedBook.tags === "string") {
        formData.append("tags", selectedBook.tags);
      }

      await updateBookContext(formData);
      await fetchBooks();

      setSelectedBook((prev) =>
        prev ? { ...prev, notes: editingNotes, cover_image: prev.cover_image || selectedBook.cover_image } : null
      );
      setIsEditingNotesModal(false);
    } catch (err: any) {
      setBooks((prev) =>
        prev.map((b) =>
          b.book_generated_id === selectedBook.book_generated_id || b._id.$oid === selectedBook._id.$oid
            ? { ...b, notes: editingNotes, cover_image: b.cover_image || selectedBook.cover_image }
            : b
        )
      );
      setSelectedBook((prev) =>
        prev ? { ...prev, notes: editingNotes, cover_image: prev.cover_image || selectedBook.cover_image } : null
      );
      setIsEditingNotesModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (book: Book, newStat: BookStatus) => {
    try {
      const formData = new FormData();
      formData.append("book_generated_id", book.book_generated_id);
      formData.append("status", newStat);
      formData.append("title", book.title);
      formData.append("author", book.author);
      formData.append("description", book.description || "");
      formData.append("notes", book.notes || "");
      if (book.cover_image) {
        formData.append("cover_image", book.cover_image);
      }
      if (Array.isArray(book.tags)) {
        formData.append("tags", book.tags.join(", "));
      } else if (typeof book.tags === "string") {
        formData.append("tags", book.tags);
      }

      await updateBookContext(formData);
      await fetchBooks();
    } catch (err) {
      setBooks((prev) =>
        prev.map((b) =>
          b.book_generated_id === book.book_generated_id || b._id.$oid === book._id.$oid
            ? { ...b, status: newStat, cover_image: b.cover_image || book.cover_image }
            : b
        )
      );
    } finally {
      if (
        selectedBook &&
        (selectedBook.book_generated_id === book.book_generated_id || selectedBook._id.$oid === book._id.$oid)
      ) {
        setSelectedBook((prev) =>
          prev ? { ...prev, status: newStat, cover_image: prev.cover_image || book.cover_image } : null
        );
      }
    }
  };

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;
    setIsSubmitting(true);
    try {
      await deleteBookContext(book.book_generated_id);
      await fetchBooks();
      setSelectedBook(null);
    } catch (err) {
      setBooks((prev) =>
        prev.filter(
          (b) => b.book_generated_id !== book.book_generated_id && b._id.$oid !== book._id.$oid
        )
      );
      setSelectedBook(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!newTitle.trim() || !newAuthor.trim()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", newTitle.trim());
      formData.append("author", newAuthor.trim());
      formData.append("description", newDescription.trim());
      formData.append("notes", newNotes.trim());
      formData.append("tags", newTags.trim());
      formData.append("status", newStatus);

      if (coverFile) {
        formData.append("cover_image", coverFile);
      }

      await createBookContext(formData);
      await fetchBooks();

      // Reset Form & Close
      setNewTitle("");
      setNewAuthor("");
      setNewDescription("");
      setNewNotes("");
      setNewTags("");
      setNewStatus("Reading");
      setCoverFile(null);
      setCoverPreview("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      const errMessage =
        typeof err === "string" ? err : err?.message || err?.error || "Failed to add book.";
      setApiError(errMessage);

      // Fallback add to local UI state if backend returns error
      const createdIso = new Date().toISOString();
      const newBookItem: Book = {
        _id: { $oid: Math.random().toString(36).substring(2, 11) },
        book_generated_id: `bgen-${Date.now()}`,
        user_generated_id: "user-local",
        title: newTitle.trim(),
        author: newAuthor.trim(),
        description: newDescription.trim() || "No description provided.",
        cover_image: coverPreview || "",
        notes: newNotes.trim() || "No notes added yet.",
        tags: newTags ? newTags.split(",").map((t) => t.trim()) : ["General"],
        status: newStatus,
        created_at: { $date: createdIso },
        updated_at: { $date: createdIso },
      };
      setBooks((prev) => [newBookItem, ...prev]);
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="woody-layout">
      {/* Sidebar Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Wrapper - Clean Off-White Canvas */}
      <div className="woody-main-wrapper">
        {/* Sticky Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="woody-content">
          {/* Welcome Banner */}
          <div className="woody-banner">
            <div className="woody-banner__content">
              <div className="woody-banner__top">
                <span className="woody-banner__date">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="woody-banner__title">Personal Library Dashboard</h1>
              <p className="woody-banner__subtitle">
                Organize, track, and annotate your lifetime collection of books.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="woody-stats-grid">
            <div className="woody-stat-card">
              <div className="woody-stat-card__icon icon-brown">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div className="woody-stat-card__info">
                <span className="woody-stat-card__value">{totalBooksCount}</span>
                <span className="woody-stat-card__label">Total No. of Books</span>
              </div>
            </div>

            <div className="woody-stat-card">
              <div className="woody-stat-card__icon icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="woody-stat-card__info">
                <span className="woody-stat-card__value">{booksReadCount}</span>
                <span className="woody-stat-card__label">Total Books Read</span>
              </div>
            </div>

            <div className="woody-stat-card">
              <div className="woody-stat-card__icon icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="woody-stat-card__info">
                <span className="woody-stat-card__value">{booksPendingCount}</span>
                <span className="woody-stat-card__label">Books Pending</span>
              </div>
            </div>

            <div className="woody-stat-card">
              <div className="woody-stat-card__icon icon-gold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="woody-stat-card__info">
                <span className="woody-stat-card__value">{recentlyAddedBooks.length}</span>
                <span className="woody-stat-card__label">Recently Added</span>
              </div>
            </div>
          </div>

          {/* Recently Added Books Showcase */}
          {recentlyAddedBooks.length > 0 && (
            <section className="woody-section">
              <div className="woody-section__header">
                <div>
                  <h2 className="woody-section__title">Recently Added Books</h2>
                  <p className="woody-section__subtitle">Latest additions to your personal library shelf</p>
                </div>
              </div>

              <div className="recent-books-row">
                {recentlyAddedBooks.map((book) => {
                  const coverSrc = getImageUrl(book.cover_image);
                  return (
                    <div
                      key={book._id?.$oid || book.book_generated_id}
                      className="recent-book-card"
                      onClick={() => handleOpenDetailModal(book)}
                    >
                      <div className="recent-book-cover">
                        {coverSrc ? (
                          <img src={coverSrc} alt={book.title} />
                        ) : (
                          <div className="book-spine-display">
                            <span className="spine-title">{book.title}</span>
                            <span className="spine-author">{book.author}</span>
                          </div>
                        )}
                      </div>
                      <div className="recent-book-info">
                        <span className="recent-book-title">{book.title}</span>
                        <span className="recent-book-author">by {book.author}</span>
                        <span className={`status-pill status-${book.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {book.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* "Your Books" Library Shelf Section */}
          <section className="woody-section" id="your-books">
            <div className="woody-section__header">
              <div>
                <h2 className="woody-section__title">Your Bookshelf</h2>
                <p className="woody-section__subtitle">Browse your collection on your personal 3D library shelf</p>
              </div>

              {/* Status Filter Tabs: All Books, Completed, Reading, Pending */}
              <div className="woody-tabs">
                <button
                  className={`woody-tab ${libraryTab === "All Books" ? "woody-tab--active" : ""}`}
                  onClick={() => setLibraryTab("All Books")}
                >
                  All Books ({totalBooksCount})
                </button>
                <button
                  className={`woody-tab ${libraryTab === "Completed" ? "woody-tab--active" : ""}`}
                  onClick={() => setLibraryTab("Completed")}
                >
                  Completed ({booksReadCount})
                </button>
                <button
                  className={`woody-tab ${libraryTab === "Reading" ? "woody-tab--active" : ""}`}
                  onClick={() => setLibraryTab("Reading")}
                >
                  Reading ({booksReadingCount})
                </button>
                <button
                  className={`woody-tab ${libraryTab === "Pending" ? "woody-tab--active" : ""}`}
                  onClick={() => setLibraryTab("Pending")}
                >
                  Pending ({booksPendingCount})
                </button>
              </div>
            </div>

            {/* Interactive Tag Filter Bar */}
            {availableTags.length > 0 && (
              <div className="woody-tag-filter-bar">
                <span className="tag-filter-label">Filter by Tag:</span>
                <button
                  className={`tag-chip-btn ${selectedTag === "All" ? "tag-chip-btn--active" : ""}`}
                  onClick={() => setSelectedTag("All")}
                >
                  All Tags
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-chip-btn ${selectedTag === tag ? "tag-chip-btn--active" : ""}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* 3D Wooden Library Shelf Container */}
            <div className="library-shelf-container">
              {books.length === 0 ? (
                <div className="empty-shelf-state">
                  <div className="empty-icon-wrap">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <h3>User doesn&apos;t have any books</h3>
                  <p>Your library is empty right now. Click &quot;Add New Book&quot; to add your first book!</p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="empty-shelf-state">
                  <div className="empty-icon-wrap">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <h3>No books match your search or filter</h3>
                  <p>Try clearing your search query or tag filter to view your books.</p>
                </div>
              ) : (
                <div className="shelf-grid">
                  {filteredBooks.map((book) => {
                    const coverSrc = getImageUrl(book.cover_image);
                    const bookTags = Array.isArray(book.tags)
                      ? book.tags
                      : typeof book.tags === "string"
                      ? (book.tags as string).split(",").map((t) => t.trim())
                      : [];

                    return (
                      <div key={book._id?.$oid || book.book_generated_id} className="shelf-item">
                        {/* Book Cover / Spine on Wooden Shelf */}
                        <div className="shelf-book-card" onClick={() => handleOpenDetailModal(book)}>
                          <div className="shelf-book-cover">
                            {coverSrc ? (
                              <img src={coverSrc} alt={book.title} />
                            ) : (
                              <div className="shelf-leather-cover">
                                <div className="leather-frame">
                                  <span className="leather-title">{book.title}</span>
                                  <span className="leather-author">{book.author}</span>
                                </div>
                              </div>
                            )}
                            <div className="book-page-depth" />
                            <span className={`shelf-status-tag tag-${book.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {book.status}
                            </span>
                          </div>

                          <div className="shelf-book-details">
                            <h4 className="shelf-title">{book.title}</h4>
                            <span className="shelf-author">by {book.author}</span>
                            <div className="shelf-tags">
                              {bookTags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className={`shelf-tag-chip ${selectedTag === t ? "shelf-tag-chip--active" : ""}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTag(t);
                                  }}
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Real Wooden Shelf Base Plank */}
              <div className="shelf-plank">
                <div className="shelf-wood-texture" />
                <div className="shelf-wood-lip" />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Book Detail Modal */}
      {selectedBook && !isEditingNotesModal && (
        <div className="woody-modal-backdrop" onClick={() => setSelectedBook(null)}>
          <div className="woody-modal" onClick={(e) => e.stopPropagation()}>
            <div className="woody-modal__header">
              <h2 className="woody-modal__title">Book Overview</h2>
              <button className="woody-modal__close" onClick={() => setSelectedBook(null)}>✕</button>
            </div>

            <div className="woody-modal__body">
              <div className="modal-hero">
                <div className="modal-hero__cover">
                  {getImageUrl(selectedBook.cover_image) ? (
                    <img src={getImageUrl(selectedBook.cover_image)} alt={selectedBook.title} />
                  ) : (
                    <div className="modal-leather-spine">
                      <span className="spine-title">{selectedBook.title}</span>
                      <span className="spine-author">{selectedBook.author}</span>
                    </div>
                  )}
                </div>

                <div className="modal-hero__info">
                  <h3>{selectedBook.title}</h3>
                  <p className="modal-author">by {selectedBook.author}</p>
                  <div className="modal-tags">
                    {(Array.isArray(selectedBook.tags)
                      ? selectedBook.tags
                      : typeof selectedBook.tags === "string"
                      ? (selectedBook.tags as string).split(",")
                      : []
                    ).map((t) => (
                      <span key={t} className="shelf-tag-chip">#{t.trim()}</span>
                    ))}
                  </div>

                  <div className="modal-status-select-wrap">
                    <label>Change Status:</label>
                    <select
                      className="woody-select"
                      value={selectedBook.status}
                      onChange={(e) => handleUpdateStatus(selectedBook, e.target.value as BookStatus)}
                    >
                      <option value="Reading">Reading</option>
                      <option value="Completed">Completed</option>
                      <option value="Plan to Read">Plan to Read</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-field">
                <label>Description</label>
                <p>{selectedBook.description}</p>
              </div>

              <div className="modal-field">
                <div className="modal-field-header">
                  <label>Personal Notes</label>
                  <button
                    className="edit-notes-link"
                    onClick={() => {
                      setEditingNotes(selectedBook.notes || "");
                      setIsEditingNotesModal(true);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    <span>Edit Notes</span>
                  </button>
                </div>
                <div className="modal-notes-quote">&ldquo;{selectedBook.notes || "No notes added yet."}&rdquo;</div>
              </div>
            </div>

            <div className="woody-modal__footer" style={{ justifyContent: "space-between" }}>
              <button
                className="woody-btn-delete"
                onClick={() => handleDeleteBook(selectedBook)}
                disabled={isSubmitting}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Delete Book</span>
              </button>
              <button className="woody-btn-secondary" onClick={() => setSelectedBook(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notes Modal */}
      {isEditingNotesModal && selectedBook && (
        <div className="woody-modal-backdrop" onClick={() => setIsEditingNotesModal(false)}>
          <div className="woody-modal" onClick={(e) => e.stopPropagation()}>
            <div className="woody-modal__header">
              <h2 className="woody-modal__title">Edit Notes: {selectedBook.title}</h2>
              <button className="woody-modal__close" onClick={() => setIsEditingNotesModal(false)}>✕</button>
            </div>

            <div className="woody-modal__body">
              <div className="modal-field">
                <label>Notes & Key Takeaways</label>
                <textarea
                  className="woody-textarea"
                  rows={5}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="woody-modal__footer">
              <button className="woody-btn-secondary" onClick={() => setIsEditingNotesModal(false)}>Cancel</button>
              <button className="woody-btn-primary" onClick={handleSaveNotes} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Book Modal with Multer Cover Upload */}
      {isAddModalOpen && (
        <div className="woody-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="woody-modal woody-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="woody-modal__header">
              <h2 className="woody-modal__title">Add New Book to Shelf</h2>
              <button className="woody-modal__close" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddBookSubmit}>
              <div className="woody-modal__body">
                {apiError && <div className="api-error-alert">{apiError}</div>}

                <div className="form-row-2">
                  <div className="modal-field">
                    <label>Book Title *</label>
                    <input
                      type="text"
                      className="woody-input"
                      required
                      placeholder="e.g. Atomic Habits"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Author *</label>
                    <input
                      type="text"
                      className="woody-input"
                      required
                      placeholder="e.g. James Clear"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                    />
                  </div>
                </div>

                {/* Multer Cover Image File Input */}
                <div className="modal-field">
                  <label>Cover Image File (Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="woody-input"
                    onChange={handleFileChange}
                  />
                  {coverPreview && (
                    <div className="thumbnail-preview-box">
                      <span>Cover Preview:</span>
                      <img src={coverPreview} alt="Cover Preview" />
                    </div>
                  )}
                </div>

                <div className="modal-field">
                  <label>Description</label>
                  <textarea
                    className="woody-textarea"
                    rows={2}
                    placeholder="Short summary of the book..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="form-row-2">
                  <div className="modal-field">
                    <label>Tags (comma separated)</label>
                    <input
                      type="text"
                      className="woody-input"
                      placeholder="Self Help, Productivity, Habits"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Status</label>
                    <select
                      className="woody-input"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as BookStatus)}
                    >
                      <option value="Reading">Reading</option>
                      <option value="Completed">Completed</option>
                      <option value="Plan to Read">Plan to Read</option>
                    </select>
                  </div>
                </div>

                <div className="modal-field">
                  <label>Notes</label>
                  <textarea
                    className="woody-textarea"
                    rows={2}
                    placeholder="Key quotes or chapter takeaways..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="woody-modal__footer">
                <button type="button" className="woody-btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="woody-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading & Saving..." : "Save to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
