"use client";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BiEdit, BiTrashAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import DeleteModal from "./DeleteModal";
import { useToast } from "@/components/ui/use-toast";

export default function TableDetails({ handleEditStudent }) {
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select();
      if (error) {
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
        setStudents(data);
      }
    };

    fetchStudents();
  }, [students, toast]);

  // Function to handle showing the delete confirmation modal
  const handleShowModal = (student) => {
    setStudentToDelete(student);
    setShowModal(true);
  };

  // Function to handle deleting a student
  const handleDeleteStudent = async (id) => {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
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
      // Update the `students` state to remove the deleted student
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
      toast({
        title: "Student deleted successfully!",
        description: "The student information has been deleted.",
        status: "success",
        duration: 5000,
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
    }
    // Hide the modal after deletion
    setShowModal(false);
    setStudentToDelete(null);
  };

  // Function to handle hiding the modal
  const handleCancelDelete = () => {
    setShowModal(false);
    setStudentToDelete(null);
  };

  return (
    <div className="container mx-auto">
      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="px-16 py-2 text-white">Name</TableHead>
            <TableHead className="px-16 py-2 text-white">Roll Number</TableHead>
            <TableHead className="px-16 py-2 text-white">Class</TableHead>
            <TableHead className="px-16 py-2 text-white">Address</TableHead>
            <TableHead className="px-16 py-2 text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        {students && (
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium px-16 py-2">
                  {student.name}
                </TableCell>
                <TableCell className="px-16 py-2">{student.roll}</TableCell>
                <TableCell className="px-16 py-2">
                  {student.studentClass}
                </TableCell>
                <TableCell className="px-16 py-2">{student.address}</TableCell>
                <TableCell className="flex">
                  {/* Call handleEditStudent when edit button is clicked */}
                  <Button
                    className="bg-transparent text-blue-500 hover:bg-transparent hover:text-blue-800"
                    onClick={() => handleEditStudent(student)}
                  >
                    <BiEdit size={25} />
                  </Button>
                  {/* Call handleDeleteStudent when delete button is clicked */}
                  <Button
                    className="bg-transparent text-red-500 hover:bg-transparent hover:text-red-800"
                    onClick={() => handleShowModal(student)}
                  >
                    <BiTrashAlt size={25} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {showModal && (
        <DeleteModal
          studentToDelete={studentToDelete}
          handleCancelDelete={handleCancelDelete}
          handleDeleteStudent={handleDeleteStudent}
        />
      )}
    </div>
  );
}
