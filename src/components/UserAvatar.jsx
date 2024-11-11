
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FaUser, FaUserLock } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils';
import { toast } from 'sonner';
import axios from 'axios';


const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate(); // Ensure useNavigate is inside the component

  
 
  // const logoutHandler = async () => {
  //   try {
  //     console.log("Attempting to log out...");
  
  //     // Add withCredentials to ensure cookies are sent in the request
  //     const response = await axios.post(
  //       "http://localhost:8800/user/logout",
  //       {},  // Empty object for the request body
  //       { withCredentials: true } // Important for sending cookies
  //     );
      
  //     console.log("Logout response:", response); // Log response to check the result
  
  //     // Clear user info if necessary
  //     localStorage.removeItem("token");
  
  //     // Navigate to the login page after successful logout
  //     navigate("/log-in");
  //   } catch (error) {
  //     console.error("Logout failed:", error); // Log any errors
  //     toast.error("Something Went Wrong");
  //   }
  // };
              
  const logoutHandler = async () => {
    try {
      console.log("Attempting to log out...");
  
      // const response = await axios.post(
      //   "http://localhost:8800/user/logout",
      //   {},
      //   { withCredentials: true }
      // );
  
      //console.log("Logout response:", response.data); // Log the response data
  
      localStorage.removeItem("token"); // Clear user info if necessary
      localStorage.removeItem("userinfo")
      navigate("/log-in"); // Navigate to login after logging out
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error); // More detailed error log
      toast.error("Something Went Wrong");
    }
  };





    return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-blue-600">
          <span className="text-white font-semibold">
          {getInitials(user?.name ? user.name : "Guest")}


          </span>
        </Menu.Button>
      
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          <div className="p-4">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setOpen(true)}
                  className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                >
                  <FaUser className="mr-2" aria-hidden="true" />
                  Profile
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setOpenPassword(true)}
                  className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                >
                  <FaUserLock className="mr-2" aria-hidden="true" />
                  Change Password
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logoutHandler}
                  className="text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base"
                >
                  <IoLogOutOutline className="mr-2" aria-hidden="true" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserAvatar;




// const logoutHandler = async () => {
//   setLoading(true);
//   try {
//     localStorage.removeItem("userinfo");
//     toast.success("Logged out successfully");
//     navigate("/log-in");
//   } catch (error) {
//     console.error("Logout failed:", error);
//     toast.error("Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

// // Button example with loading state
// <Menu.Item>
//   {({ active }) => (
//     <button
//       onClick={logoutHandler}
//       disabled={loading}
//       className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base ${active ? 'bg-red-100' : ''}`}
//     >
//       <IoLogOutOutline className="mr-2" aria-hidden="true" />
//       {loading ? "Logging out..." : "Logout"}
//     </button>
//   )}
// </Menu.Item>
