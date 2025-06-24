import { Chat } from './ChatClient';
import ChatListItem from './ChatListItem';

type ChatListProps = {
  chats: Chat[];
};

export default function ChatList({ chats }: ChatListProps) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
} 