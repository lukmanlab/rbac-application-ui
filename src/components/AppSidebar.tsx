import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Atom, DoorOpen, House, ShieldCheck, ShieldUser, UserRoundCog, Wrench } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "User",
    url: "/",
    icon: UserRoundCog,
  },
  {
    title: "Tenant",
    url: "/tenant",
    icon: House,
  },
  {
    title: "Role",
    url: "/role",
    icon: ShieldCheck,
  },
  {
    title: "Resource",
    url: "/resource",
    icon: Atom,
  },
  {
    title: "Action",
    url: "/action",
    icon: Wrench,
  },
  {
    title: "Permission",
    url: "/permission",
    icon: DoorOpen,
  },
  {
    title: "User Role",
    url: "/user-roles",
    icon: ShieldUser,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>RBAC Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
