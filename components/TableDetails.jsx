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

export default function TableDetails({ handleEditStudent }) {
  const [fetchError, setFetchError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select();
      if (error) {
        setFetchError(error.message || "An error occurred. Please try again.");
      } else {
        setStudents(data);
        setFetchError(null);
      }
    };

    fetchStudents();
  }, []);

  // Function to handle deleting a student
  const handleDeleteStudent = async (id) => {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      setDeleteError(error.message || "An error occurred. Please try again.");
    } else {
      // Update the `students` state to remove the deleted student
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    }
  };

  return (
    <Table className="container mx-auto">
      {fetchError && <p className="text-red-600">{fetchError}</p>}
      {deleteError && <p className="text-red-600">{deleteError}</p>}
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
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <BiTrashAlt size={25} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
