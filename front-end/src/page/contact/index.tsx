import React from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import ContactForm from './ContactForm';
import ContactDetails from './ContactDetails';
import MapSection from './MapSection';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

       <HeroSection 
          title="Nếu động vật có thể nói, chúng sẽ nói về chúng ta!"
          subtitle="NLU Pet Shop"
          buttonText="Mua ngay"
          buttonLink="/products"
        />
      
      <main className="flex-grow mt-5">  
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <ContactForm />
              </div>
              
              <div>
                <ContactDetails />
              </div>
            </div>
          </div>
        </section>
        
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <MapSection />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;