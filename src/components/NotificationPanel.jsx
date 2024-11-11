// import axios from 'axios';
// import { useEffect, useState } from 'react';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       setLoading(true);
//       setError("");
      
//       const token = localStorage.getItem('token'); // Retrieve token from localStorage
//       if (!token) {
//         setError("User is not authenticated. Please log in.");
//         setLoading(false);
//         return;
//       }
      
//       try {
//         const response = await axios.get('http://localhost:8800/user/notifications', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setNotifications(response.data); // Store fetched notifications
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//         setError("Failed to load notifications. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   if (loading) return <p>Loading notifications...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div>
//       <h2>Notifications</h2>
//       <ul>
//         {notifications.map((notification, index) => (
//           <li key={index}>{notification.message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;













import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState, useEffect } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found, please log in.");
          }
      
          const response = await axios.get("http://localhost:8800/user/notifications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          // Handle response
          console.log("Notifications:", response.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      

    fetchNotifications();
  }, []);

  // Mark notifications as read
  const markAsRead = async (id = "all") => {
    try {
      await axios.put(`/user/read-noti?isReadType=${id === "all" ? "all" : ""}&id=${id}`);
      if (id === "all") {
        setNotifications(notifications.map(noti => ({ ...noti, isRead: [/* userId */] })));
      } else {
        setNotifications(
          notifications.map((noti) =>
            noti._id === id ? { ...noti, isRead: [/* userId */] } : noti
          )
        );
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const viewHandler = (item) => {
    markAsRead(item._id);
  };

  const callsToAction = [
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => markAsRead("all"),
    },
    { name: "Cancel", href: "#", icon: "" },
  ];

  if (loading) return <p>Loading notifications...</p>;

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {notifications?.length > 0 && (
              <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
                {notifications.length}
              </span>
            )}
          </div>
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              notifications?.length > 0 && (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {notifications.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => viewHandler(item)}
                        >
                          <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                            <p>{item.notiType}</p>
                            <span className="text-xs font-normal lowercase">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="line-clamp-1 mt-1 text-gray-600">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 divide-x bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={item?.onClick ? () => item.onClick() : () => close()}
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;

