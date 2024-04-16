"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function FormData({ selectedStudent, setSelectedStudent }) {
  const { toast } = useToast(); // Import and initialize the useToast hook

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (selectedStudent) {
      setName(selectedStudent.name);
      setRoll(selectedStudent.roll);
      setStudentClass(selectedStudent.studentClass);
      setAddress(selectedStudent.address);
    } else {
      setName("");
      setRoll("");
      setStudentClass("");
      setAddress("");
    }
  }, [selectedStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for valid roll number
    if (isNaN(roll) || roll === "") {
      setFormError("Please enter a valid roll number.");
      return;
    }
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("roll", roll)
      .maybeSingle();

    if (
      existingStudent &&
      (!selectedStudent || existingStudent.id !== selectedStudent.id)
    ) {
      toast({
        title: "An error occurred. Please try again.",
        description:
          "The roll number already exists. Please enter a unique roll number.",
        status: "error",
        duration: 5000,
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });

      return;
    }

    if (selectedStudent) {
      // Update existing student
      const { error } = await supabase
        .from("students")
        .update({ name, roll, studentClass, address })
        .eq("id", selectedStudent.id);

      if (error) {
        console.log(error);
        toast({
          title: "An error occurred. Please try again.",
          description: error.message,
          status: "error",
          duration: 5000,
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      } else {
        // Success: Reset form and error state
        setName("");
        setRoll("");
        setStudentClass("");
        setAddress("");
        setSelectedStudent(null);
        toast({
          title: "Student updated successfully!",
          description: "The student information has been updated.",
          status: "success",
          duration: 5000,
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
      }
    } else {
      // Insert a new student
      const { data, error } = await supabase
        .from("students")
        .insert([{ name, roll, studentClass, address }]);

      if (error) {
        console.log(error);
        toast({
          title: "An error occurred. Please try again.",
          description: error.message,
          status: "error",
          duration: 5000,
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      } else {
        // Success: Reset form and error state
        setName("");
        setRoll("");
        setStudentClass("");
        setAddress("");
        setSelectedStudent(null);
        toast({
          title: "Student added successfully!",
          description: "The student information has been added.",
          status: "success",
          duration: 5000,
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
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
          required
        />
        <Input
          type="number"
          placeholder="Roll Number"
          value={roll}
          onChange={(e) => setRoll(parseInt(e.target.value))}
          required
        />
        <Input
          type="text"
          placeholder="Class"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Button type="submit" className="w-32 bg-green-700">
          {selectedStudent ? "Update" : "Add"}
        </Button>
      </form>
    </div>
  );
}
