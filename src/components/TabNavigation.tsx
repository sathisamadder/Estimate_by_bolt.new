import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'pile', label: 'পাইল', icon: 'P', color: 'bg-primary-500' },
  { id: 'footing', label: 'ফুটিং', icon: 'F', color: 'bg-warning-500' },
  { id: 'column', label: 'কলাম', icon: 'C', color: 'bg-error-500' },
  { id: 'beam', label: 'বিম', icon: 'B', color: 'bg-purple-500' },
  { id: 'slab', label: 'স্ল্যাব', icon: 'S', color: 'bg-indigo-500' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? `${tab.color} text-white shadow-md transform scale-105`
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              <span className={activeTab === tab.id ? 'text-white' : 'text-gray-600'}>
                {tab.icon}
              </span>
            </div>
            <span className="text-sm md:text-base">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}