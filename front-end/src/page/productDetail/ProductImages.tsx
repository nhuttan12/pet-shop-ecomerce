import React, { useState, useRef, useEffect } from 'react';

interface ProductImagesProps {
  mainImage: string;
  thumbnails: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ mainImage, thumbnails }) => {
  const allImages = [mainImage, ...thumbnails];
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleThumbnailClick = (index: number) => {
    setSelectedThumbnail(index);
    // Scroll to the selected image in the scroll container
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[index] as HTMLElement;
      if (child) {
        container.scrollTo({
          left: child.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  // Khi selectedThumbnail thay đổi, scroll ảnh chi tiết đến ảnh đó
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[selectedThumbnail] as HTMLElement;
      if (child) {
        container.scrollTo({
          left: child.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedThumbnail]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails bên trái */}
      <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-4 order-2 md:order-1 overflow-auto max-h-[600px]">
        {allImages.map((thumbnail, index) => (
          <div
            key={index}
            className={`w-[150px] h-[150px] border ${
              selectedThumbnail === index ? 'border-red-500' : 'border-gray-200'
            } flex items-center justify-center cursor-pointer`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className="max-h-[168px] max-w-[112px] object-contain"
            />
          </div>
        ))}
      </div>

      {/* Thanh ảnh chi tiết có thể kéo ngang */}
      <div
        className="w-full md:w-3/4 order-1 md:order-2 overflow-x-auto whitespace-nowrap"
        ref={scrollRef}
        style={{ scrollBehavior: 'smooth' }}
      >
        {allImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Main image ${index + 1}`}
            className={`inline-block max-h-[600px] object-contain mr-4 cursor-pointer ${
              selectedThumbnail === index ? 'border-4 border-red-500 rounded-lg' : ''
            }`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
