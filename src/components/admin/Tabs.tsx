import React from 'react';

// Types
interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// Components
export const Tabs: React.FC<TabsProps> = ({ children, value, onValueChange }) => {
  // Create context to pass value and onValueChange to children
  const tabsContext = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  
  return (
    <div className="w-full">
      <TabsContext.Provider value={tabsContext}>
        {children}
      </TabsContext.Provider>
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return (
    <div className="flex space-x-2 border-b border-beige-200">
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value }) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  
  const isActive = selectedValue === value;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-all relative ${
        isActive 
          ? 'text-rose-500' 
          : 'text-taupe-600 hover:text-taupe-800'
      }`}
      onClick={() => onValueChange(value)}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400"></div>
      )}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ children, value, className = '' }) => {
  const { value: selectedValue } = useTabsContext();
  
  if (selectedValue !== value) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Context
type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}