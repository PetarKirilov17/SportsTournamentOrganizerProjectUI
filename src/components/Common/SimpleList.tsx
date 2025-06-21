import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SimpleListProps {
  title: string;
  items: Array<{
    id: number;
    title: string;
    subtitle?: string;
    status?: string;
    icon?: LucideIcon;
  }>;
  emptyMessage: string;
}

export function SimpleList({ title, items, emptyMessage }: SimpleListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                {item.status && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {item.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}