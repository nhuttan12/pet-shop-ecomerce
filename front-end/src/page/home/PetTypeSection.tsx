import React from 'react';
import { Link } from 'react-router-dom';

interface PetType {
    id: string;
    name: string;
    image: string;
    backgroundImage: string;
}

interface PetTypeSectionProps {
    petTypes: PetType[];
}

const PetTypeSection: React.FC<PetTypeSectionProps> = ({ petTypes }) => {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-semibold">Mua sắm theo thú cưng</h2>
                    <div className="flex space-x-4">
                        <button className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
                            <img src="/images/img_vector_12x6.svg" alt="Previous" className="w-3 h-1.5 transform rotate-180" />
                        </button>
                        <button className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
                            <img src="/images/img_vector_12x6.svg" alt="Next" className="w-3 h-1.5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between">
                    {petTypes.map((pet) => (
                        <Link to={`/pets/${pet.id}`} key={pet.id} className="text-center mb-8">
                            <div className="relative mb-4">
                                <img src={pet.backgroundImage} alt="" className="w-[187px] h-[180px]" />
                                <img
                                    src={pet.image}
                                    alt={pet.name}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80%] max-h-[80%]"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{pet.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PetTypeSection;