import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Briefcase,
  ShoppingCart,
  CreditCard,
  Package,
  FileText,
  Video,
  BookOpen,
  Users as UsersPool,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Campaigns", url: "/admin/campaigns", icon: Video },
  { title: "Transactions", url: "/admin/transactions", icon: DollarSign },
  { title: "Marketplace", url: "/admin/marketplace", icon: ShoppingCart },
  { title: "Verifications", url: "/admin/verifications", icon: Shield },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Settings", url: "/admin/settings", icon: Briefcase },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14 bg-black/40 border-white/10" : "w-60 bg-black/40 border-white/10"}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-l-2 border-purple-500" 
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
