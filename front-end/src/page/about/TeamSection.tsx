import React from 'react';
import people from '../../assets/people.jpg';
import dog from '../../assets/dog.jpg';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageSrc: string;
}

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Nguyễn Hoài Thương',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 2,
      name: 'Nguyễn Minh Hiệp',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 3,
      name: 'Đoàn Quốc Đăng',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 4,
      name: 'Phạm Lê Đạt',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 5,
      name: 'Nguyễn Văn Trọng',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 6,
      name: 'Hồ Hữu Thức',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 7,
      name: 'Nguyễn Thanh Triu',
      role: 'Seller',
      imageSrc: people
    },
    {
      id: 8,
      name: 'Phạm Nhựt Tân',
      role: 'Seller',
      imageSrc: dog
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-16">Đội ngũ của chúng tôi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col items-center">
              <div className="w-full h-[416px] rounded-[20px] overflow-hidden mb-4">
                <img 
                  src={member.imageSrc} 
                  alt={member.name} 
                  className="w-full h-full object-cover rounded-[20px]"
                />
              </div>
              <h3 className="text-2xl font-semibold text-center">{member.name}</h3>
              <p className="text-base font-semibold text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;