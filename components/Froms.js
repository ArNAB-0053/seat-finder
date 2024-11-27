"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FaCheckCircle } from "react-icons/fa"; // Importing a check icon

const Forms = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    location: "",
  });
  const [examCentres, setExamCentres] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedExamDate, setSelectedExamDate] = useState(null);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false); // New state for the success icon

  // Fetch exam centres
  useEffect(() => {
    const fetchExamCentres = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/exam-centres`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExamCentres(data);
      } catch (error) {
        console.log("Error fetching exam centres:", error);
      }
    };

    fetchExamCentres();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/subjects`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data?.subjects)) {
          setSubjects(data?.subjects);
        } else {
          console.log("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.log("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") {
      const selectedCentre = examCentres.find(
        (centre) => centre.place === value
      );
      setSelectedExamDate(
        selectedCentre ? new Date(selectedCentre.examDate).toISOString() : null
      );
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the examDate to the form data before sending it to the server
    const formDataToSend = {
      ...formData,
      examDate: selectedExamDate,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Registration successful !`
        );

        // Display the success icon and set it to hide after 3 seconds
        setShowSuccessIcon(true);
        setTimeout(() => setShowSuccessIcon(false), 3000);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          location: "",
        });
        setSelectedExamDate(null);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      setMessage("An error occurred during registration.");
    }
  };

  return (
    <div className={`flex flex-col md:flex-row max-w-6xl mx-auto p-6 ${!showSuccessIcon && 'shadow-lg' } rounded-lg gap-x-6 bg-gray-50 relative`}>
      {showSuccessIcon ? (
          <div className="absolute h-[50vh] inset-0 flex flex-col items-center justify-center bg-green-100 bg-opacity-75 p-6 rounded-lg">
            <FaCheckCircle size={40}  className="text-green-500 text-6xl animate-bounce" />
              <p className="text-center text-lg text-blue-500 mb-4 font-semibold">
                {message}
              </p>
          </div>
        ): (
          <>
          <div className="hidden md:flex md:w-1/3 bg-blue-100 p-4 items-center justify-center rounded-lg shadow-md">
        <Image
          src="/file.png"
          width={600}
          height={600}
          alt="Illustrative image"
          className="h-auto w-full object-cover rounded-md select-none"
        />
      </div>
      <div className="md:w-2/3 w-full px-4 relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out  hover:border-blue-400"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out  hover:border-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-800"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out  hover:border-blue-400"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-800"
            >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out  hover:border-blue-400"
              required
            >
              <option value="" disabled className="text-gray-400">
                Select a subject
              </option>
              {Array.isArray(subjects) &&
                subjects.map((subject) => (
                  <option key={subject.id} value={subject.subject}>
                    {subject.subject}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-800"
            >
              Exam Centre
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out  hover:border-blue-400"
              required
            >
              <option value="" disabled>
                Select an exam centre
              </option>
              {examCentres.map((centre) => (
                <option key={centre._id} value={centre.place}>
                  {centre.place} -{" "}
                  {new Date(centre.examDate).toLocaleDateString()} (
                  {centre.availableSeats} seats)
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
          >
            Register
          </Button>
        </form>
      </div>
          </>
        )}
      
    </div>
  );
};

export default Forms;
