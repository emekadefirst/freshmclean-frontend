import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsArrowLeft, BsCheckCircleFill, BsUpload, BsX } from "react-icons/bs";
// import { useTranslation } from "react-i18next";
import { submitKYC } from "../services/cleaner";


const CleanerForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    resume: null,
    idProof: null,
    workAuth: null,
  });

  const [fileNames, setFileNames] = useState({
    resume: "",
    idProof: "",
    workAuth: "",
  });




  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
  });

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phone));
  };

  const validateStep = (step) => {
    let valid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      if (!formData.fullname.trim()) {
        newErrors.fullname = "Full Name is required";
        valid = false;
      } else {
        newErrors.fullname = "";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Invalid Email";
        valid = false;
      } else {
        newErrors.email = "";
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone Number is required";
        valid = false;
      } else if (!validatePhone(formData.phoneNumber)) {
        newErrors.phoneNumber = "Invalid Phone Number";
        valid = false;
      } else {
        newErrors.phoneNumber = "";
      }
    }

    if (step === 2) {
      if (!formData.resume) {
        toast.warning("Please upload your resume");
        valid = false;
      }
      if (!formData.idProof) {
        toast.warning("Please upload your proof of ID");
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [name]: files[0].name,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: null,
    }));
    setFileNames((prevFileNames) => ({
      ...prevFileNames,
      [fieldName]: "",
    }));
  };

  const goBack = () => {
    navigate('/membership');
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateStep(currentStep)) {
      setLoading(true);
  
      const payload = new FormData();
      payload.append("fullname", formData.fullname);
      payload.append("phone_number", formData.phoneNumber);
  
      if (formData.resume) {
        payload.append("resume", formData.resume);
      }
      if (formData.idProof) {
        payload.append("id_proof", formData.idProof);
      }
      if (formData.workAuth) {
        payload.append("work_authorization", formData.workAuth);
      }
  
      try {
        const access_token = localStorage.getItem('access_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`
          },
          body: payload
        });
        const data = await response.json();
        
        if (!response.ok) {
          // Handle API error response
          const errorMessage = data.detail || 'Failed to submit application';
          throw new Error(errorMessage);
        }
        
        console.log(data);
        toast.success("Application received");
        setCurrentStep(totalSteps);
  
        setFormData({
          fullname: "",
          email: "",
          phoneNumber: "",
          resume: null,
          idProof: null,
          workAuth: null,
        });
  
        setFileNames({
          resume: "",
          idProof: "",
          workAuth: "",
        });
  
      } catch (error) {
        console.error("Application failed:", error);
        // Show user-friendly error message
        toast.error(error.message || "Failed to submit application. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between mb-8 relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10"></div>

        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={`step-${stepNum}`} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {isCompleted ? <BsCheckCircleFill className="w-5 h-5" /> : stepNum}
              </div>
              <span className={`text-xs mt-2 ${isActive ? 'text-blue-500 font-medium' : isCompleted ? 'text-green-500' : 'text-gray-500'}`}>
                {stepNum === 1 ? "Personal Information" :
                  stepNum === 2 ? "Upload documents" :
                    "Review Application"}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPersonalInfoStep = () => {
    return (
      <>
        <h2 className="text-xl font-medium mb-6 text-gray-800">Personal Information</h2>
        <div className="space-y-5">
          <div>
            <label className="mb-2 text-sm text-gray-700 block font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className={`border ${errors.fullname ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder:text-gray-400 bg-white py-3 px-4 block w-full focus:border-blue-500 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
          </div>

          <div>
            <label className="mb-2 text-sm text-gray-700 block font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="happyuser@example.com"
              className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder:text-gray-400 bg-white py-3 px-4 block w-full focus:border-blue-500 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-2 text-sm text-gray-700 block font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className={`border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder:text-gray-400 bg-white py-3 px-4 block w-full focus:border-blue-500 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>
      </>
    );
  };

  const FileUploadBox = ({ name, label, required = false, accept }) => {
    const getFileTypeText = () => {
      if (accept === '.pdf') return 'PDF file';
      if (accept.includes('.jpg') || accept.includes('.jpeg') || accept.includes('.png')) return 'Image file (JPG, JPEG, PNG)';
      return 'file';
    };

    return (
      <div>
        <label className="mb-2 text-sm text-gray-700 block font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`border-2 border-dashed ${formData[name] ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded-lg p-5 flex flex-col items-center transition-all hover:border-blue-300 hover:bg-blue-50`}>
          {!formData[name] ? (
            <>
              <input
                type="file"
                name={name}
                onChange={handleChange}
                className="hidden"
                id={name}
                accept={accept}
              />
              <label
                htmlFor={name}
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
              >
                <BsUpload className="text-gray-400 text-2xl mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  Upload {getFileTypeText()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  max size 10mb
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium"
                  onClick={() => document.getElementById(name).click()}
                >
                  Select
                </button>
              </label>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between bg-white p-3 rounded-md">
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">
                    <BsCheckCircleFill />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {fileNames[name]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(name)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <BsX className="text-xl" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDocumentsStep = () => {
    return (
      <>
        <h2 className="text-xl font-medium mb-6 text-gray-800">Upload Documents</h2>
        <div className="space-y-6">
          <FileUploadBox
            name="resume"
            label="Resume"
            required={true}
            accept=".pdf"
          />

          <FileUploadBox
            name="idProof"
            label="ID Proof"
            required={true}
            accept=".jpg,.jpeg,.png"
          />

          <FileUploadBox
            name="workAuth"
            label="Work authorization"
            required={false}
            accept=".jpg,.jpeg,.png"
          />

        </div>
      </>
    );
  };

  const renderReviewStep = () => {
    return (
      <>
        <h2 className="text-xl font-medium mb-6 text-gray-800">Review Application</h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Cleaner Info</h3>
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">Full Name</span>
              <span className="text-sm font-medium">{formData.fullname}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium">{formData.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">Phone Number</span>
              <span className="text-sm font-medium">{formData.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-medium text-gray-800 mb-3">Uploaded Documents</h3>
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">Resume</span>
              <span className="text-sm font-medium text-green-600">{fileNames.resume || "no file found"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">ID Proof</span>
              <span className="text-sm font-medium text-green-600">{fileNames.idProof || "no file found"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">Work Authorization</span>
              <span className="text-sm font-medium">{fileNames.workAuth || "no file found"}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            Review Message
          </p>
        </div>
      </>
    );
  };

  const renderSuccessStep = () => {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <BsCheckCircleFill className="text-green-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Recieved
        </h2>
        <p className="text-gray-600 mb-8">
          Successful
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-5 rounded-md font-medium"
        >
          Redirecting
        </button>
      </div>
    );
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderDocumentsStep();
      case 3:
        return renderReviewStep();
      case 4:
        return renderSuccessStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="apply-bg py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-gray-900 text-3xl md:text-4xl font-bold mb-2">
              Application
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ToastContainer position="top-center" />

          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            {currentStep <= totalSteps && (
              <div className="flex items-center mb-6">
                <button
                  type="button"
                  onClick={currentStep === 1 ? goBack : prevStep}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <BsArrowLeft className="mr-1" />
                  <span className="text-sm font-medium">
                    {currentStep === 1 ? "Back" : "Previous"}
                  </span>
                </button>
              </div>
            )}

            {currentStep <= totalSteps && renderStepIndicator()}

            <form onSubmit={handleSubmit}>
              {renderFormStep()}

              {currentStep <= totalSteps && (
                <div className="mt-8 flex justify-end space-x-3">
                  {currentStep > 1 && currentStep <= totalSteps && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < totalSteps && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium"
                    >
                      Next
                    </button>
                  )}

                  {currentStep === totalSteps && (
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium flex items-center justify-center min-w-[100px]"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanerForm;