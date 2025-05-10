import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MiniLoader from "./ui/miniloader";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // const { t } = useTranslation();
  const apiUrl = "process.env.REACT_APP_API_URL";

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define footer links structure for maintainability
  const footerSections = [
    {
      title: "Product",
      links: [
        { to: "/coming-soon", text: "Benefits" },
        { to: "/coming-soon", text: "Features" },
        // { to: '/price', text: "Pricing" }
      ],
    },
    {
      title: "Company",
      links: [
        { to: "/about", text: "About" },
        { to: "/coming-soon", text: "Customers" },
        { to: "/faqs", text: "FAQS" },
        // { to: '/contact', text: "Contacts" }
      ],
    },
    {
      title: "Use cases",
      links: [
        { to: "/coming-soon", text: "For Cleaner" },
        { to: "/coming-soon", text: "For Clients" },
        { to: "/privacy-policy", text: "Privacy Policy" },
        { to: "/terms", text: "Terms of Service" },
      ],
    },
  ];

  return (
    <footer className="bg-black pt-12 pb-16 px-4 md:px-10 lg:px-20">
      <div className="flex flex-col md:flex-row justify-between gap-10 text-white">
        {/* Company Info and Subscribe */}
        <div className="max-w-md md:max-w-xs">
          <h2 className="font-bold text-2xl mb-4">FreshMClean</h2>
          <p className="text-sm mb-6">
            {/* {t("home.services.footerText")} */}
            House cleaning services at your fingertip
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white py-2 px-4 rounded-md outline-none text-black flex-grow"
            />
            <button
              type="submit"
              className="bg-blue-600 py-2 px-6 rounded-md flex justify-center items-center"
              disabled={loading}
            >
              {loading ? <MiniLoader /> : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <div className="flex flex-col space-y-2">
                {section.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    to={link.to}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-gray-700 text-white text-center">
        <p>© {year} FreshMClean, Inc.</p>
      </div>
    </footer>
  );
}
