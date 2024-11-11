import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { Routes, Route, Navigate, Outlet, useLocation, replace } from 'react-router-dom'
import Tasks from './pages/Tasks'
import Users from './pages/Users'
import Dashboard from './pages/Dashboard'
import TaskDetails from './pages/TaskDetails'
import { Toaster } from 'sonner'
import Trash from './pages/Trash'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import clsx from 'clsx'
import { IoClose } from "react-icons/io5"
import { Transition } from '@headlessui/react'
import { Fragment, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"








//layout function
function Layout(){
 //const user = ""
 const user = localStorage.getItem("token")
  const location = useLocation()
  return user ? (
<div className='w-full h-screen flex flex-col md:flex-row'>
  <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
<Sidebar /> 

  </div>
 <MobileSidebar />

<div className='flex-1 overflow-y-auto'>
<Navbar />
<div className='P-4 2xl:PX-10 '>
  <Outlet />
</div>

</div>

</div>
  ):(
    <Navigate to="/log-in" state={{from: location}} replace/>
  )
}









const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);  //This extracts the isSidebarOpen value from the auth slice of the Redux store. 
  const mobileMenuRef = useRef(null);// This creates a reference to the sidebar DOM element, though it’s not directly used here. This can be useful if you want to programmatically interact with the sidebar later (for example, focusing an input inside the sidebar when it opens).
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false)); 
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0 translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
      >
        {(ref) => (     //passing it directly to the mobileMenuRef
          <div
            ref={(node) => (mobileMenuRef.current = node)}   
            //This assigns the rendered div element to mobileMenuRef.current, so later you can directly access this div element via mobileMenuRef if you need to manipulate it (e.g., programmatically focus it or check its dimensions).
      //useRef is a React hook that allows you to persist a reference to a DOM element across renders without causing the component to re-render.
 
            className={clsx(    //clsx is used here to conditionally apply CSS classes based on whether isSidebarOpen is true or false. This allows the sidebar to either show or hide with a smooth transition.
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className="bg-white w-3/4 h-full" onClick={(e) => e.stopPropagation()}>
              <div className="w-full flex justify-end px-5 mt-5">
                <button
                  onClick={() => closeSidebar()}
                  className="flex justify-end items-end"
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className="-mt-10">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};








function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<main className='w-full min-h-screen bg-[#f3f4f6]' >
<Routes>  
{/* protected routes */}
<Route element={<Layout />}>
<Route path='/' element={<Navigate to="/dashboard"/>} />
<Route path='/dashboard' element={<Dashboard />} />
<Route path='/tasks' element={<Tasks />} />
<Route path='/completed/:status' element={<Tasks />} />
<Route path='/in-progress/:status' element={<Tasks />} />
<Route path='/todo/:status' element={<Tasks />} />
<Route path='/team' element={<Users />} />
<Route path='/trashed' element={<Trash />} />
<Route path='/task/:id' element={<TaskDetails />} />
</Route>

<Route path='/log-in' element={<Login />} />


</Routes>

<Toaster richColors/>
<Outlet />
 </main>,
    </>
  )
}

export default App
