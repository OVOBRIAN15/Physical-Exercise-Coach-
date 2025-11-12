
import React from 'react';
import { Book } from '../types';
import { BookOpenIcon } from './Icons';

interface BookCardProps {
  book: Book;
  hasPurchased: boolean;
  onBuyBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, hasPurchased, onBuyBook, onReadBook }) => {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-transparent overflow-hidden transition-transform hover:scale-105 duration-300">
      <img src={book.coverImage} alt={`Cover for ${book.title}`} className="h-56 w-full object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">{book.title}</h2>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">by {book.author}</p>
        <p className="mt-4 text-gray-600 dark:text-gray-text flex-grow">{book.description}</p>
        <div className="mt-6">
          {hasPurchased ? (
            <button
              onClick={() => onReadBook(book)}
              className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-md transition-opacity hover:bg-opacity-90"
            >
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Read Now
            </button>
          ) : (
            <button
              onClick={() => onBuyBook(book)}
              className="w-full px-6 py-3 bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold rounded-md transition-opacity hover:bg-opacity-90"
            >
              Buy for ${book.price.toLocaleString('en-US')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;