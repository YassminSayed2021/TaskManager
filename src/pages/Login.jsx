import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Loading from "../components/Loading";

const Login = () => {
  const { user } = useSelector((state) => state.auth); // Get user state from Redux
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const submitHandler = async (data) => {
    try {
      setIsLoading(true); // Start loading spinner

      // Send login request with credentials enabled (for cookies)
      const response = await axios.post("http://localhost:8800/user/login", data, {
        withCredentials: true, // Ensures cookies are sent and received
      });
      localStorage.setItem("token", response.data.token);

      // Assuming response has user data and cookie token is set on the backend
      const { user } = response.data;

      // Store user info in localStorage (optional) or Redux if needed
      localStorage.setItem("userinfo", JSON.stringify({ user }));

      setIsLoading(false); // Stop loading spinner
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (error) {
      setIsLoading(false); // Stop loading spinner on error
      console.error(error);
      toast.error(error?.response?.data?.message || error.message); // Show error notification
    }
  };

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your tasks in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Task Manager</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div>
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome!
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                Forget Password?
              </span>

              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  label="Submit"
                  className="w-full h-10 bg-blue-700 text-white rounded-full"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;













// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Textbox from "../components/Textbox";
// import Button from "../components/Button";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";
// import Loading from "../components/Loading";

// const Login = () => {
//   const { user } = useSelector((state) => state.auth);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false); // Define isLoading state

//   const submitHandler = async (data) => {
//     try {
//       setIsLoading(true); // Set loading to true when request starts

//       const response = await axios.post("http://localhost:8800/user/login", data);

//       // Assuming response has user data and token
//       const { user, token } = response.data;

//       // Save user info in localStorage or Redux if needed
//       localStorage.setItem("userinfo", JSON.stringify({ user, token }));

//       setIsLoading(false); // Set loading to false when request finishes

//       navigate("/dashboard");
//     } catch (error) {
//       setIsLoading(false); // Set loading to false on error
//       console.error(error);
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     if (user) navigate("/dashboard");
//   }, [user, navigate]);

//   return (
//     <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
//       <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
//         {/* Left side */}
//         <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
//           <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
//             <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-30…