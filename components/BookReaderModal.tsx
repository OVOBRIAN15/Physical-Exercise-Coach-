

import React from 'react';
import { Book } from '../types';
import MarkdownRenderer from '../services/MarkdownRenderer';

interface BookReaderModalProps {
  book: Book;
  onClose: () => void;
}

const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
        <header className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">{book.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">by {book.author}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-3xl leading-none">&times;</button>
        </header>
        <main className="flex-grow overflow-y-auto p-6 sm:p-8">
            <MarkdownRenderer content={book.content} />
        </main>
      </div>
    </div>
  );
};

export default BookReaderModal;
