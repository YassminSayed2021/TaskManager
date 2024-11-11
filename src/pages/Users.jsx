
import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import axios from "axios";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState({
    result: [],
    err: null,
    update: false,
  });

  // Function to get the value of a specific cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Get the token from cookies
  const token = localStorage.getItem('token');
  

  // Fetch users from the API
  useEffect(() => {
    console.log("Retrieved token:", token); // Log token retrieval
    if (!token) {
      console.error("No token found, cannot make authenticated request."); // Log if token is null
      return;
    }

    axios
      .get("http://localhost:8800/user/get-team", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Fetched users:", response.data); // Log response data
        setUsers({ ...users, result: response.data, err: null });
      })
      .catch((errors) => {
        console.error("Error fetching users:", errors); // Log errors
        setUsers({ ...users, err: [{ msg: errors.response?.data.message || 'An error occurred' }] });
      });
  }, [users.update, token]);

 
  // Function to handle user deletion
  const deleteHandler = async () => {
    if (!selected) return;

    try {
      await axios.delete(`http://localhost:8800/user/${selected}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh users after successful deletion
      setUsers((prevUsers) => ({
        ...prevUsers,
        update: !prevUsers.update,
      }));

      alert("User deleted successfully!");
      setOpenDialog(false);
      setSelected(null); // Clear selected user after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };
  
// Function to handle user editing
const editHandler = async (userData) => {
  console.log("Data to be updated:", userData); // Log the user data before sending the request
  try {
    // Sending the request to update the user profile
    await axios.put("http://localhost:8800/user/profile", userData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token for authorization
      },
    });
    alert("User updated successfully!");
    setOpen(false); // Close the edit modal
    setUsers((prevState) => ({ ...prevState, update: !prevState.update })); // Refresh user list
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    alert(error.response?.data?.message || "Error updating user"); // Show error message
  }
};

// editClick sets the user data and opens the modal for editing
const editClick = (user) => {
  setSelected(user); // Pass the user data to the modal
  setOpen(true);     // Open the modal
};


//activation 

const activateHandler = async (userId, isActive) => {
  try {
    await axios.put(
      `http://localhost:8800/user/${userId}`, // Assuming you have this route set up
      { isActive: !isActive }, // Toggle the current active status
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert(`User ${isActive ? "deactivated" : "activated"} successfully!`);
    setUsers((prevState) => ({ ...prevState, update: !prevState.update }));
  } catch (error) {
    console.error("Error changing user activation status:", error);
    alert("Error changing user activation status");
  }
};





  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">{getInitials(user.name)}</span>
          </div>
          {user.name}
        </div>
      </td>
      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email || "user.email.com"}</td>
      <td className="p-2">{user.role}</td>
      <td>
      <button
        className={clsx("w-fit px-4 py-1 rounded-full", user?.isActive ? "bg-blue-200" : "bg-yellow-100")}
        onClick={() => activateHandler(user._id, user.isActive)} // Call the activation handler
      >
        {user?.isActive ? "Deactivate" : "Activate"}
      </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0" label="Edit" type="button" onClick={() => editClick(user)} />
        <Button className="text-red-700 hover:text-red-500 font-semibold sm:px-0" label="Delete" type="button" onClick={() => deleteClick(user?._id)} />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {users.result.length > 0 ? (
                  users.result.map((user) => <TableRow key={user._id} user={user} />)
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        onSave={editHandler} // Pass the edit handler to the AddUser component
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler} // Confirm delete action
      />
    </>
  );
};

export default Users;

