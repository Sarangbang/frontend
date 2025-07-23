import Image from 'next/image';
import { ChatRoomResponse } from '@/types/Chat';

type ChatListItemProps = {
  chat: ChatRoomResponse;
  onClick: () => void;
};

export default function ChatListItem({ chat, onClick }: ChatListItemProps) {
  return (
    <li className="p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={onClick}>
      <Image
        src={chat.challengeImageUrl || '/images/charactors/gamza.png'}
        alt={chat.roomName}
        width={56}
        height={56}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <p className="font-bold truncate dark:text-white">{chat.roomName}</p>
          <p className="text-sm text-gray-500">{chat.participants?.length ?? 0}명</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {chat.createdAt ? new Date(chat.createdAt).toLocaleString() : ''}
        </p>
      </div>
    </li>
  );
} 