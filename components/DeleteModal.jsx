"use client";
import { Button } from "./ui/button";

export default function DeleteModal({
  handleCancelDelete,
  handleDeleteStudent,
  studentToDelete,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this student?
        </h2>
        <div className="flex justify-end space-x-4">
          <Button className="bg-gray-300" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white"
            onClick={() => handleDeleteStudent(studentToDelete.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
