import React from 'react';
import StaticDataPanel from './StaticDataPanel';
import ContentUpdatePanel from './ContentUpdatePanel';

const StaticDataManager: React.FC = () => {
  return (
    <div>
      <ContentUpdatePanel />
      <StaticDataPanel />
    </div>
  );
};

export default StaticDataManager;
