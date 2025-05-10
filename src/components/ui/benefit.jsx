import React from 'react';
import convenience from '../../assets/benefitImages/convenience.png';
import spotless from '../../assets/benefitImages/spotless.png';
import time from '../../assets/benefitImages/time.png';
import trusted from '../../assets/benefitImages/trusted.png';

const benefitArr = [convenience, spotless, time, trusted];

const BenefitSection = () => {
  return (
    <section className="bg-primary-benefit flex flex-col justify-center items-center py-10 font-helvetica-neue">
      <p className="mb-20 text-indigo-950 font-semibold uppercase text-lg">
        Benefits
      </p>
      <div className="flex justify-center items-center xs:px-4 sm:px-0" data-aos="fade-up">
        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-10 max-xs:px-4">
          {benefitArr.map((image, index) => (
            <div key={index} data-aos="fade-up">
              <div className="relative">
                <img 
                  src={image} 
                  alt={`Benefit ${index + 1}`} 
                  className="w-[450px] h-[450px] max-xs:w-[400px] max-xs:h-[400px]"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;