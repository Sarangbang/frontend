import Image from 'next/image';
import { Chat } from './ChatClient';

type ChatListItemProps = {
  chat: Chat;
  onClick: () => void;
};

export default function ChatListItem({ chat, onClick }: ChatListItemProps) {
  const unreadCountDisplay =
    chat.unreadCount > 100 ? '100+' : chat.unreadCount;

  return (
    <li className="p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={onClick}>
      <Image
        src={chat.avatar}
        alt={chat.name}
        width={56}
        height={56}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          {chat.type === 'group' &&
            chat.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200"
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="flex items-baseline space-x-2">
          <p className="font-bold truncate dark:text-white">{chat.name}</p>
          {chat.type === 'group' && (
            <p className="text-sm text-gray-500">{chat.participantCount}</p>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {chat.lastMessage}
        </p>
      </div>
      <div className="flex flex-col items-end space-y-1 text-xs text-gray-400">
        <span>{chat.timestamp}</span>
        {chat.unreadCount > 0 && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCountDisplay}
          </span>
        )}
      </div>
    </li>
  );
} 