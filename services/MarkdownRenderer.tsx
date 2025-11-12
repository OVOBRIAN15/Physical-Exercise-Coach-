
import React from 'react';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
      .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/# (.*?)\n/g, '<h1 class="text-3xl font-extrabold mt-8 mb-4">$1</h1>')
      .replace(/- (.*?)\n/g, '<li class="ml-5 list-disc">$1</li>')
      .replace(/\n/g, '<br />');
  
    return <div className="prose dark:prose-invert text-gray-600 dark:text-gray-text max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default MarkdownRenderer;