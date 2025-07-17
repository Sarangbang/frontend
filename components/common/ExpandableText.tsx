'use client';

import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

const ExpandableText = ({ text, maxLength = 100 }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{text}</p>;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={toggleExpanded}
        className="text-sm font-semibold mt-1 hover:underline"
        style={{ color: '#F47150' }}
      >
        {isExpanded ? '접기' : '더보기'}
      </button>
    </div>
  );
};

export default ExpandableText; 