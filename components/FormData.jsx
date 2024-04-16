"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function FormData({ selectedStudent, setSelectedStudent }) {
  // Initialize state variables
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");
  const { toast } = useToast(); // Use the useToast hook

  // When selectedStudent changes, populate the form fields
  useEffect(() => {
    if (selectedStudent) {
      setName(selectedStudent.name);
      setRoll(selectedStudent.roll);
      setStudentClass(selectedStudent.studentClass);
      setAddress(selectedStudent.address);
    } else {
      // Clear form fields when no student is selected
      setName("");
      setRoll("");
      setStudentClass("");
      setAddress("");
    }
  }, [selectedStudent]);

  const handleSubmit = async (e) => {
    // Form validation
    if (!name || !roll || !studentClass || !address) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (selectedStudent) {
      // Update existing student record
      const { error } = await supabase
        .from("students")
        .update({ name, roll, studentClass, address })
        .eq("id", selectedStudent.id);

      if (error) {
        console.error(error);
        setFormError(error.message || "An error occurred. Please try again.");
      } else {
        // Success: Reset form and error state
        setName("");
        setRoll("");
        setStudentClass("");
        setAddress("");
        setFormError(null);
        setSelectedStudent(null);

        // Display toast notification
        toast({ description: "Student updated successfully!" });
      }
    } else {
      // Insert a new student record
      const { error } = await supabase
        .from("students")
        .insert([{ name, roll, studentClass, address }]);

      if (error) {
        console.error(error);
        setFormError(error.message || "An error occurred. Please try again.");
      } else {
        // Success: Reset form and error state
        setName("");
        setRoll("");
        setStudentClass("");
        setAddress("");
        setFormError(null);

        // Display toast notification
        toast({ description: "Student added successfully!" });
      }
    }
  };

  return (
    <div className="container mx-auto my-10">
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-2 gap-5 w-full lg:w-[50%]"
      >
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Roll Number"
          value={roll}
          onChange={(e) => setRoll(parseInt(e.target.value))}
        />
        <Input
          type="text"
          placeholder="Class"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {formError && <p className="text-red-600">{formError}</p>}
        <Button type="submit" className="w-32 bg-green-700">
          {selectedStudent ? "Update" : "Add"}
        </Button>
      </form>
    </div>
  );
}
