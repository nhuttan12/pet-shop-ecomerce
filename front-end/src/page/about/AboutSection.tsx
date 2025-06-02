import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold mb-8">Về cửa hàng của chúng tôi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-base text-gray-800 leading-relaxed">
              Đội ngũ nhân viên của chúng tôi là những người yêu thú cưng và có nhiều kinh nghiệm trong việc chăm sóc và tư vấn. Chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc lựa chọn sản phẩm và giải đáp mọi thắc mắc.
            </p>
          </div>
          <div>
            <p className="text-base text-gray-800 leading-relaxed">
              Chúng tôi không chỉ là một cửa hàng, mà còn là một người bạn đồng hành của bạn và thú cưng của bạn. Hãy đến với chúng tôi để trải nghiệm sự tận tâm và chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;