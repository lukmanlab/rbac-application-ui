import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import UserPage from "./pages/users/UserPage"
import TenantPage from "./pages/tenants/TenantPage"
import RolePage from "./pages/roles/RolePage"
import ResourcePage from "./pages/resources/ResourcePage"
import ActionPage from "./pages/actions/ActionPage"
import PermissionPage from "./pages/permissions/PermissionPage"
import RolePermissionPage from "./pages/role-permissions/RolePermissionPage"
import UserRolePage from "./pages/user-roles/UserRolePage"
import LoginPage from "./pages/login/LoginPage"
import { getAccessToken } from "./utils/localStorage"

const isHasAccessToken = () => {
  const token = getAccessToken()
  return !!token;
}

const ProtectedRoute = () => {
  return isHasAccessToken() ? <Outlet /> : <Navigate to="/" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route element={<ProtectedRoute />}>
        <Route path="/user" element={<UserPage />}/>
        <Route path="/tenant" element={<TenantPage />}/>
        <Route path="/role" element={<RolePage />}/>
        <Route path="/resource" element={<ResourcePage />}/>
        <Route path="/action" element={<ActionPage />}/>
        <Route path="/permission" element={<PermissionPage />}/>
        <Route path="/role-permission-mapping" element={<RolePermissionPage />}/>
        <Route path="/user-roles" element={<UserRolePage />}/>
      </Route>
    </Routes>
  )
}

export default App
