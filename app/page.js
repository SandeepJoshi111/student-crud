"use client";

import React, { useState } from "react";
import FormData from "@/components/FormData";
import TableDetails from "@/components/TableDetails";
import { Button } from "@/components/ui/button";
import { BiUserPlus } from "react-icons/bi";

export default function Home() {
  // State variable to manage form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  // State variable to hold the selected student data
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
    setSelectedStudent(null);
  };

  // Function to handle editing of a student
  const handleEditStudent = (student) => {
    // Set the selected student data in state
    setSelectedStudent(student);
    // Open the form for editing
    setIsFormVisible(true);
  };

  return (
    <>
      <main>
        <h1 className="text-xl md:text-5xl text-center font-bold py-10">
          Student Management
        </h1>
        <div className="container mx-auto flex justify-between py-5 border-b">
          <Button className="bg-indigo-500" onClick={toggleFormVisibility}>
            Add Student
            <span className="px-2">
              <BiUserPlus size={25} />
            </span>
          </Button>
        </div>
        {/* Show the form and pass the selected student data */}
        <div
          className={`transition-transform duration-300 ease-in-out transform ${
            isFormVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[-20px]"
          }`}
        >
          {isFormVisible && (
            <FormData
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
            />
          )}
        </div>
        {/* Pass the handleEditStudent function to TableDetails */}
        <TableDetails handleEditStudent={handleEditStudent} />
      </main>
    </>
  );
}
