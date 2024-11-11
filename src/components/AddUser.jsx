// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ModalWrapper from "./ModalWrapper";
// import { Dialog } from "@headlessui/react";
// import Textbox from "./Textbox";
// import Loading from "./Loading";
// import Button from "./Button";
// import { toast } from "sonner"; // Assuming you are using Sonner for notifications

// const AddUser = ({ open, setOpen, userData }) => {
//   const defaultValues = userData ?? {}; // Set default values if editing
//   const { user } = useSelector((state) => state.auth); // Get logged-in user info
//   const [isLoading, setIsLoading] = useState(false); // Loading state

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ defaultValues });

//   const handleOnSubmit = async (formData) => {
//     setIsLoading(true); // Start loading
//     try {
//       if (userData) {
//         // If editing an existing user
//         const response = await axios.put(
//           "http://localhost:8800/user/profile", // API endpoint for updating user
//           { ...formData, _id: userData._id },  // Include user ID in the request
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`, // Include auth token
//             },
//           }
//         );
//         toast.success("User updated successfully!"); // Success toast
//       } else {
//         // If adding a new user
//         const response = await axios.post(
//           "http://localhost:8800/user/register", // API endpoint for adding a new user
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`, // Include auth token
//             },
//           }
//         );
//         toast.success("User added successfully!"); // Success toast
//       }

//       setOpen(false); // Close modal on success
//     } catch (error) {
//       setIsLoading(false); // Stop loading on error
//       toast.error(error.response?.data?.message || "Something went wrong!"); // Error toast
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   return (
//     <ModalWrapper open={open} setOpen={setOpen}>
//       <form onSubmit={handleSubmit(handleOnSubmit)} className="">
//         <Dialog.Title
//           as="h2"
//           className="text-base font-bold leading-6 text-gray-900 mb-4"
//         >
//           {userData ? "UPDATE PROFILE" : "ADD NEW USER"} {/* Conditional title */}
//         </Dialog.Title>
//         <div className="mt-2 flex flex-col gap-6">
//           {/* Full name field */}
//           <Textbox
//             placeholder="Full name"
//             type="text"
//             name="name"
//             label="Full Name"
//             className="w-full rounded"
//             register={register("name", {
//               required: "Full name is required!",
//             })}
//             error={errors.name ? errors.name.message : ""}
//           />
//           {/* Title field */}
//           <Textbox
//             placeholder="Title"
//             type="text"
//             name="title"
//             label="Title"
//             className="w-full rounded"
//             register={register("title", {
//               required: "Title is required!",
//             })}
//             error={errors.title ? errors.title.message : ""}
//           />
//           {/* Email address field */}
//           <Textbox
//             placeholder="Email Address"
//             type="email"
//             name="email"
//             label="Email Address"
//             className="w-full rounded"
//             register={register("email", {
//               required: "Email Address is required!",
//             })}
//             error={errors.email ? errors.email.message : ""}
//           />
//           {/* Role field */}
//           <Textbox
//             placeholder="Role"
//             type="text"
//             name="role"
//             label="Role"
//             className="w-full rounded"
//             register={register("role", {
//               required: "User role is required!",
//             })}
//             error={errors.role ? errors.role.message : ""}
//           />
//           {/* Password field only for new user */}
//           {!userData && (
//             <Textbox
//               placeholder="Password"
//               type="password"
//               name="password"
//               label="Password"
//               className="w-full rounded"
//               register={register("password", {
//                 required: "Password is required!",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters long",
//                 },
//               })}
//               error={errors.password ? errors.password.message : ""}
//             />
//           )}
//         </div>

//         {isLoading ? (
//           <div className="py-5">
//             <Loading /> {/* Show loading spinner */}
//           </div>
//         ) : (
//           <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
//             {/* Submit button */}
//             <Button
//               type="submit"
//               className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
//               label="Submit"
//             />
//             {/* Cancel button */}
//             <Button
//               type="button"
//               className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
//               onClick={() => setOpen(false)}
//               label="Cancel"
//             />
//           </div>
//         )}
//       </form>
//     </ModalWrapper>
//   );
// };

// export default AddUser;































import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loading";
import Button from "./Button";
import { toast } from "sonner"; // Assuming you are using Sonner for notifications

const AddUser = ({ open, setOpen, userData }) => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: userData ? userData.name : '',
      title: userData ? userData.title : '',
      email: userData ? userData.email : '',
      role: userData ? userData.role : '',
      password: '', // You might not want to prefill the password
    },
  });

  // Use useEffect to reset the form when userData changes
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        title: userData.title,
        email: userData.email,
        role: userData.role,
      });
    }
  }, [userData, reset]);

  const handleOnSubmit = async (formData) => {
    console.log("Form Data Submitted: ", formData);
    setIsLoading(true);
    if (userData) {
      try {
        const response = await axios.put(
          "http://localhost:8800/user/profile",
          {
            _id: userData._id, // Ensure the correct ID is passed
            name: formData.name,
            title: formData.title,
            role: formData.role,
            email: formData.email, // Include email if needed
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Make sure token is correct
            },
          }
        );
        toast.success("User updated successfully!");
        setOpen(false); // Close modal after success
      } catch (error) {
        console.error(error); // Log for debugging
        toast.error(error.response?.data?.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8800/user/register",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("User added successfully!");
        setOpen(false); // Close modal after success
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response?.data?.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
        <Dialog.Title
          as='h2'
          className='text-base font-bold leading-6 text-gray-900 mb-4'
        >
          {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
        </Dialog.Title>
        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Full name'
            type='text'
            name='name'
            label='Full Name'
            className='w-full rounded'
            register={register("name", {
              required: "Full name is required!",
            })}
            error={errors.name ? errors.name.message : ""}
          />
          <Textbox
            placeholder='Title'
            type='text'
            name='title'
            label='Title'
            className='w-full rounded'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />
          
          <Textbox
            placeholder='Role'
            type='text'
            name='role'
            label='Role'
            className='w-full rounded'
            register={register("role", {
              required: "User role is required!",
            })}
            error={errors.role ? errors.role.message : ""}
          />

          {/* Add password field */}
          {!userData && (
            <>
                       <Textbox
            placeholder='Email Address'
            type='email'
            name='email'
            label='Email Address'
            className='w-full rounded'
            register={register("email", {
              required: "Email Address is required!",
            })}
            error={errors.email ? errors.email.message : ""}
          />
            <Textbox
              placeholder='Password'
              type='password'
              name='password'
              label='Password'
              className='w-full rounded'
              register={register("password", {
                required: "Password is required!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              error={errors.password ? errors.password.message : ""}
            />
            </>
          )}
        </div>

        {isLoading ? (
          <div className='py-5'>
            <Loading />
          </div>
        ) : (
          <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
            <Button
              type='submit'
              className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
              label='Submit'
            />
            <Button
              type='button'
              className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
              onClick={() => setOpen(false)}
              label='Cancel'
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;

