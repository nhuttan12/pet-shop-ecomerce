import React from 'react';

const MapSection: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md">
      <img 
        src="/images/img_map_pin_420x1296.png" 
        alt="NLU Pet Shop Location Map" 
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default MapSection;