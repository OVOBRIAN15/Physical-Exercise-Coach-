
import React, { useState } from 'react';
import { Book, User, BookCategory } from '../types';
import BookCard from './BookCard';

interface BooksPageProps {
  books: Book[];
  user: User | null;
  onBuyBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

const BooksPage: React.FC<BooksPageProps> = ({ books, user, onBuyBook, onReadBook }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BookCategory>('All');

  const hasPurchased = (bookId: string) => {
    return user?.purchasedBookIds?.includes(bookId) ?? false;
  };

  const categories: ('All' | BookCategory)[] = ['All', ...Object.values(BookCategory)];

  const filteredBooks = selectedCategory === 'All'
    ? books
    : books.filter(book => book.category === selectedCategory);

  const baseButtonClasses = "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg focus:ring-primary-light dark:focus:ring-primary";
  const activeButtonClasses = "bg-primary-light dark:bg-primary text-white dark:text-secondary shadow";
  const inactiveButtonClasses = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className="bg-white dark:bg-light-bg py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-light-text">Fitness Library</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-text">
            Expand your knowledge with our curated collection of fitness and nutrition e-books.
          </p>
        </div>

        <div className="mt-12 flex justify-center flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${baseButtonClasses} ${selectedCategory === category ? activeButtonClasses : inactiveButtonClasses}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard 
                key={book.id}
                book={book}
                hasPurchased={hasPurchased(book.id)}
                onBuyBook={onBuyBook}
                onReadBook={onReadBook}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                <p className="text-xl text-gray-600 dark:text-gray-text">No books found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;