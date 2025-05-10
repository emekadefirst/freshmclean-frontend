import McDonald from "../../assets/partnerImages/McDonald.png";
import Stripe from "../../assets/partnerImages/stripe.png";
import CapitalOne from "../../assets/partnerImages/capital.png";
import Pfizer from "../../assets/partnerImages/Pfizer.png";
import Toyota from "../../assets/partnerImages/Toyota.png";


// import { useTranslation } from "react-i18next";

export default function Partners() {
  const images = [Stripe, Toyota, Pfizer, CapitalOne, McDonald];
  // const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center font-helvetica-neue pt-10 text-center">
        <p className="font-semibold text-md md:text-xl mb-5">Partners</p>
        <p className="text-lg md:text-3xl font-semibold">
          Get in touch with us
        </p>
      </div>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-24 lg:gap-24 md:gap-8 max-md:gap-x-0 sm:gap-y-10 xs:gap-x-40 px-12 xs:gap-y-6`}
      >
        {images.map((img, index) => {
          return (
            <div key={index} className="flex items-center justify-center">
              <img
                src={img}
                alt={`Partners ${index + 1}`}
                className="max-w-[150px] hover:scale-[1.1] cursor-pointer duration-150"
              />
            </div>
          );
        })}
      </div>
      {/* <div
        className={`grid md:grid-cols-5 xs:grid-cols-2 my-24 lg:gap-24 md:gap-8 max-md:gap-x-0  sm:gap-y-10 sm:px-4  xs:gap-x-40 xs:px-14 xs:gap-y-6`}
      >
        {images.map((img, index) => {
          return (
            <div key={index} className="flex items-center justify-center">
              <img
                src={img}
                alt={`Partners ${index + 1}`}
                className="max-w-[150px]"
              />
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
