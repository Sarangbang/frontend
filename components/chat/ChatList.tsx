import { ChatRoomResponse } from '@/types/Chat';
import ChatListItem from './ChatListItem';

type ChatListProps = {
  chats: ChatRoomResponse[];
  onChatClick: (chat: ChatRoomResponse) => void;
};

export default function ChatList({ chats, onChatClick }: ChatListProps) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {chats.map((chat) => (
        <ChatListItem key={chat.roomId} chat={chat} onClick={() => onChatClick(chat)} />
      ))}
    </ul>
  );
} 