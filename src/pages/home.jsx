import "aos/dist/aos.css";
import AOS from "aos";
import Orb from "../assets/images/orb.png";
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BenefitSection from "../components/ui/benefit";
import Button from "../components/ui/button";
import Testimonials from "../components/ui/testimonal";
import Pricing from "../components/ui/pricing";
import Partners from "../components/ui/partners";




// Images
import comfyRoom from "../assets/images/living-room.png";
import Carousel2 from "../assets/images/carousel2.jpg";
import Carousel3 from "../assets/images/carousel3.jpg"

const HomePage = () => {

    const images = [comfyRoom, Carousel2, Carousel3];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [images.length]);


    return (
        <>
            <div className="min-h-screen relative w-full">
                <Link
                    to="https://wa.me/+4915216901919"
                    target="_blank"
                    className="fixed right-3 bottom-3 z-40 p-1 bg-green-400 rounded-full border-white border-4"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp Logo"
                        className="w-[40px] md:w-[60px] rounded-full"
                    />
                </Link>

                {/* Section 1 */}
                <section className="section-header">
                    <div className="text-center bg-white pt-10 pb-28 mb-0 z-10 relative">
                        <div className="orb absolute top-3 left-6">
                            <img src={Orb} className="" alt="" />
                        </div>
                        <span
                            data-aos="fade-up"
                            className="px-2.5 py-2 text-xs font-medium uppercase bg-blue-100 text-blue-600 rounded-lg mt-10 inline-block"
                        >
                            freshmclean
                        </span>

                        <h1
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="text-3xl md:text-4xl lg:text-6xl font-medium mt-4 !leading-[3rem] md:!leading-[5rem] w-[97%] md:w-[75%] mx-auto"
                        >
                            House cleaning services at <br /> your &nbsp;
                            <span
                                data-aos="fade-up"
                                data-aos-delay="900"
                                className="px-3 py-[1px] text-white bg-blue-700 rounded-lg"
                            >
                                fingertip
                            </span>
                        </h1>

                        <div
                            className="inline-block mt-4"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <Link to="/book-cleaning" className="font-medium text-sm rounded-lg px-4 py-2.5 transition duration-150">
                                <Button variant="dark" className="mt-6">
                                    Book Cleaning
                                </Button>
                            </Link>

                        </div>
                    </div>

                    <div className="relative bg-white pb-10" data-aos="fade-up">
                        <div className="overflow-hidden md:rounded-xl w-full mx-auto h-[350px] sm:h-[350px] md:h-[550px]">
                            <div
                                className="flex transition-transform duration-700 ease-in-out h-full w-full"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        className="w-full h-full object-cover flex-shrink-0"
                                        alt={`Slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="bg-primary-benefit flex flex-col justify-center items-center py-10 font-helvetica-neue">
                    <div
                        className="flex justify-center items-center xs:px-4 sm:px-0"
                        data-aos="fade-up"
                    >
                        <BenefitSection />
                    </div>
                </section>
                <div style={{ backgroundColor: "#F4F8FA" }}>
                    <Pricing />
                </div>
                <div style={{ backgroundColor: "#F4F8FA" }}>
                    <Testimonials />
                </div>

                <div className="bg-white">
                    <Partners />
                </div> 
            </div>

        </>
    );
};

export default HomePage;