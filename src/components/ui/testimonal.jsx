import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useState, useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

const TestimonyCard = ({ img, icon, desc, name, title, rating }) => {
  return (
    <div className="flex flex-col py-7 px-4 xs:w-[330px] sm:-ml-0 sm:-mr-0 sm:w-[450px] shadow-sm h-fit border border-gray-300 bg-white rounded-lg gap-y-6 font-helvetica-neue">
      <div className="flex space-x-2">
        <p>Rating:</p>
        <p>{"⭐".repeat(rating)}</p>
      </div>
      <div className="max-w-[450px] text-sm md:text-base">
        <p>{desc}</p>
      </div>
      <div className="flex gap-x-6">
        <img src={img} alt={name} className="rounded-full" width={45} height={45} />
        <div>
          <p className="font-semibold">{name}</p>
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Sample testimonial data
  const testimonialData = [
    {
      id: 1,
      img: "https://avatar.iran.liara.run/public/20",
      icon: "https://avatar.iran.liara.run/public/20",
      desc: "As a small business owner, I needed a reliable team to clean our office space after hours. This company exceeded my expectations. They were professional, thorough, and respectful of our workspace. Highly recommend them!",
      name: "Feranmi Mike",
      title: "Software Engineer",
      rating: 4
    },
    {
      id: 2,
      img: "https://avatar.iran.liara.run/public/21",
      icon: "https://avatar.iran.liara.run/public/21",
      desc: "I've tried several cleaning services, but none compare to this one. The attention to detail is impressive. My home has never looked better. They are thorough, efficient, and always on time.",
      name: "Sarah Johnson",
      title: "Marketing Director",
      rating: 5
    },
    {
      id: 3,
      img: "https://avatar.iran.liara.run/public/22",
      icon: "https://avatar.iran.liara.run/public/22",
      desc: "The deep cleaning service was exactly what my home needed after renovation. Every corner was spotless. The team was friendly, efficient, and went above and beyond my expectations.",
      name: "David Chen",
      title: "Restaurant Owner",
      rating: 5
    },
    {
      id: 4,
      img: "https://avatar.iran.liara.run/public/23",
      icon: "https://avatar.iran.liara.run/public/23",
      desc: "I schedule regular cleaning for my rental properties, and this service has been a lifesaver. Consistent quality, reasonable prices, and my tenants always comment on how clean everything is when they move in.",
      name: "Lisa Taylor",
      title: "Property Manager",
      rating: 4
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonialData.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="py-10 font-helvetica-neue xl:px-52 lg:px-32 md:px-16 sm:px-8 xs:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between my-20">
        <div className="mb-6 md:mb-0">
          <p className="font-semibold text-2xl md:text-3xl mb-4" data-aos="fade-up">
            Testimonials
          </p>
          <p className="text-sm md:text-md inline-block max-w-[400px]" data-aos="fade-up" data-aos-delay="300">
            Hear what our customers have to say about our services.
          </p>
        </div>
        <div className="flex gap-x-6">
          <button
            onClick={prevSlide}
            className="border border-black rounded-full w-[40px] h-[40px] flex justify-center items-center transition-all hover:bg-black hover:text-white"
            aria-label="Previous testimonial"
          >
            <GoChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="border border-black rounded-full w-[40px] h-[40px] flex justify-center items-center transition-all hover:bg-black hover:text-white"
            aria-label="Next testimonial"
          >
            <GoChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" data-aos="fade-up">
        <div 
          className="flex transition-transform ease-in-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonialData.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 w-full">
              <TestimonyCard
                img={testimonial.img}
                icon={testimonial.icon}
                desc={testimonial.desc}
                name={testimonial.name}
                title={testimonial.title}
                rating={testimonial.rating}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {testimonialData.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;