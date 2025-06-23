// import React, { useState } from 'react';

// interface ProductImagesProps {
//   mainImage: string;
//   thumbnails: string[];
// }

// const ProductImages: React.FC<ProductImagesProps> = ({ mainImage, thumbnails }) => {
//   const [currentImage, setCurrentImage] = useState<string>(mainImage);
//   const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);

//   const handleThumbnailClick = (image: string, index: number) => {
//     setCurrentImage(image);
//     setSelectedThumbnail(index);
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-4">
//       <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-4 order-2 md:order-1">
//         {thumbnails.map((thumbnail, index) => (
//           <div 
//             key={index}
//             className={`w-[150px] h-[150px] border ${
//               selectedThumbnail === index ? 'border-red-500' : 'border-gray-200'
//             } flex items-center justify-center cursor-pointer`}
//             onClick={() => handleThumbnailClick(thumbnail, index)}
//           >
//             <img 
//               src={thumbnail} 
//               alt={`Product thumbnail ${index + 1}`} 
//               className="max-h-[168px] max-w-[112px] object-contain"
//             />
//           </div>
//         ))}
//       </div>
      
//       <div className="w-full md:w-3/4 order-1 md:order-2 relative">
//         <img 
//           src={currentImage} 
//           alt="Product main image" 
//           className="w-full max-w-[600px] h-auto object-contain"
//         />
//         {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 h-4 w-[403px] rounded-lg"></div> */}
//       </div>
//     </div>
//   );
// };

// export default ProductImages;
import React, { useState } from 'react';

interface ProductImagesProps {
  mainImage: string;
  thumbnails: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ mainImage, thumbnails }) => {
  const [currentImage, setCurrentImage] = useState<string>(mainImage);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(-1);

  const handleThumbnailClick = (image: string, index: number) => {
    setCurrentImage(image);
    setSelectedThumbnail(index);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-4 order-2 md:order-1">
        {[mainImage, ...thumbnails].map((thumbnail, index) => (
          <div 
            key={index}
            className={`w-[150px] h-[150px] border ${
              selectedThumbnail === index ? 'border-red-500' : 'border-gray-200'
            } flex items-center justify-center cursor-pointer`}
            onClick={() => handleThumbnailClick(thumbnail, index)}
          >
            <img 
              src={thumbnail} 
              alt={`Thumbnail ${index + 1}`} 
              className="max-h-[168px] max-w-[112px] object-contain"
            />
          </div>
        ))}
      </div>

      <div className="w-full md:w-3/4 order-1 md:order-2 relative">
        <img 
          src={currentImage} 
          alt="Main product" 
          className="w-full max-w-[600px] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default ProductImages;
