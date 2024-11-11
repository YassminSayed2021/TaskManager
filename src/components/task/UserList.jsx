import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import clsx from "clsx";
import { MdCheck } from "react-icons/md";
import axios from "axios";
import { getInitials } from "../../utils"; // Assuming you have this utility function

const UserList = ({ setTeam, team }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8800/user/get-team", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Set the initial selected team members if they exist
  useEffect(() => {
    if (team?.length > 0) {
      const selected = users.filter((user) => team.includes(user._id));
      setSelectedUsers(selected);
    } else if (users.length > 0) {
      setSelectedUsers([users[0]]); // Set the first user as default if no team is selected
    }
  }, [team, users]);

  // Handle selection change
  const handleChange = (selected) => {
    setSelectedUsers(selected);
    setTeam(selected?.map((user) => user._id));
  };

  return (
    <div>
      <p className="text-gray-700">Assign Task To: </p>
      <Listbox value={selectedUsers} onChange={(el) => handleChange(el)} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm">
            <span className="block truncate">
              {selectedUsers?.map((user) => user.name).join(", ")}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {users?.map((user, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    clsx("relative cursor-default select-none py-2 px-4", active ? "bg-sky-100 text-ascent-2" : "text-gray-900")
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="h-6 w-6 inline-flex justify-center items-center text-sm rounded-full bg-ascent-2 text-white">
                          {getInitials(user?.name)}
                        </span>
                        <span className={clsx("block truncate", selected ? "font-bold" : "font-normal")}>
                          {user?.name}
                        </span>
                      </div>

                      {selected ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-ascent-2">
                          <MdCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;

