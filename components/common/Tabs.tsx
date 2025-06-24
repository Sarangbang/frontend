'use client';

export type Tab<T extends string> = {
  id: T;
  label: string;
};

type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  setActiveTab: (tab: T) => void;
};

export default function Tabs<T extends string>({
  tabs,
  activeTab,
  setActiveTab,
}: TabsProps<T>) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {tabs.map(({ id, label }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 text-center text-lg font-semibold cursor-pointer ${
              isActive
                ? 'border-b-2 border-black dark:border-white font-semibold'
                : 'text-gray-400 dark:text-gray-500'
            }`}
            role="tab"
            aria-selected={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
} 