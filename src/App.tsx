import { Route, Routes } from "react-router-dom"
import UserPage from "./pages/users/UserPage"
import TenantPage from "./pages/tenants/TenantPage"
import RolePage from "./pages/roles/RolePage"
import ResourcePage from "./pages/resources/ResourcePage"
import ActionPage from "./pages/actions/ActionPage"
import PermissionPage from "./pages/permissions/PermissionPage"
import RolePermissionPage from "./pages/role-permissions/RolePermissionPage"
import UserRolePage from "./pages/user-roles/UserRolePage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />}/>
      <Route path="/tenant" element={<TenantPage />}/>
      <Route path="/role" element={<RolePage />}/>
      <Route path="/resource" element={<ResourcePage />}/>
      <Route path="/action" element={<ActionPage />}/>
      <Route path="/permission" element={<PermissionPage />}/>
      <Route path="/role-permission-mapping" element={<RolePermissionPage />}/>
      <Route path="/user-roles" element={<UserRolePage />}/>
    </Routes>
  )
}

export default App
