import { JSX, useState } from 'react';
import TabItem from '@components/TabItem/TabItem';

const tabs: { id: string; label: string }[] = [
  { id: 'tab-1', label: 'All Products' },
  { id: 'tab-2', label: 'Vegetables' },
  { id: 'tab-3', label: 'Fruits' },
  { id: 'tab-4', label: 'Bread' },
  { id: 'tab-5', label: 'Meat' },
];

export default function ProductTab(): JSX.Element {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  return (
    <div className="row g-4">
      <div className="col-lg-4 text-start">
        <h1>Our Organic Products</h1>
      </div>
      <div className="col-lg-8 text-end">
        <ul className="nav nav-pills d-inline-flex text-center mb-5">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              id={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
