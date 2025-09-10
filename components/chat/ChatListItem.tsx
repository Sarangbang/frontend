import Image from 'next/image';
import { ChatRoomResponse } from '@/types/Chat';
import { formatMessageDate } from '@/util/messageDateUtils';

type ChatListItemProps = {
  chat: ChatRoomResponse;
  onClick: () => void;
};

export default function ChatListItem({ chat, onClick }: ChatListItemProps) {
  return (
    <li
      className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      onClick={onClick}
    >
      <div className="flex min-w-0 items-center space-x-4">
        <Image
          src={chat.challengeImageUrl || '/images/charactors/gamza.png'}
          alt={chat.roomName}
          width={56}
          height={56}
          className="flex-shrink-0 rounded-full"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/charactors/gamza.png';
          }}
        />
        <div className="min-w-0">
          <div className="flex items-baseline space-x-2">
            <p className="truncate font-bold dark:text-white">{chat.roomName}</p>
            <p className="text-sm text-gray-500">
              {chat.participants?.length ?? 0}명
            </p>
          </div>
          {chat.lastChatMessage && (
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {chat.lastChatMessage}
            </p>
          )}
        </div>
      </div>

      <div className="ml-4 flex flex-shrink-0 flex-col items-end">
        {chat.lastMessageCreatedAt && (
          <p className="text-sm text-gray-500">
            {formatMessageDate(chat.lastMessageCreatedAt)}
          </p>
        )}
        <div className="mt-1 h-6">
          {chat.unreadCount > 0 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
