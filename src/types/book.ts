export interface MongoId {
  $oid: string;
}

export interface MongoDate {
  $date: string;
}

export type BookStatus = "Reading" | "Completed" | "Plan to Read";

export interface Book {
  _id: MongoId;
  book_generated_id: string;
  user_generated_id: string;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  notes: string;
  tags: string[];
  status: BookStatus;
  created_at: MongoDate;
  updated_at: MongoDate;
  rating?: number;
  progressPages?: number;
  totalPages?: number;
}
