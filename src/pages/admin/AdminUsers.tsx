import axios from "axios";
import { useEffect, useState } from "react";

import AdminNav from "../../components/admin/nav/AdminNav";
import UserTable from '../../components/admin/content/UserTable'

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios("https://fierce-spring-store-backend.herokuapp.com/api/user")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="admin-container">
      <UserTable users={users} setUsers={setUsers} />
      <AdminNav />
    </div>
  );
}
