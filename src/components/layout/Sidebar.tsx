import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Activity,
  GitPullRequest,
  Layout,
  MessageSquare,
  FileText,
  Clock,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Briefcase,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  hasChildren?: boolean;
  isOpen?: boolean;
  toggleOpen?: () => void;
  count?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  hasChildren,
  isOpen,
  toggleOpen,
  count,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md
        ${isActive ? "bg-primary text-white" : "text-text hover:bg-background"}
      `}
      onClick={
        hasChildren
          ? (e) => {
              e.preventDefault();
              toggleOpen && toggleOpen();
            }
          : undefined
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs bg-background/10 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
      {hasChildren && (
        <span className="text-text-muted">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    projects: false,
    workPackages: false,
    timeAndCosts: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="w-64 bg-white border-r border-border h-full overflow-y-auto">
      <div className="p-4 space-y-1">
        <SidebarItem to="/" icon={<Home size={18} />} label="Overview" />
        <SidebarItem
          to="/assign-user-to-project"
          icon={<Briefcase size={18} />}
          label="Projects"
        />
        <SidebarItem
          to="/activity"
          icon={<Activity size={18} />}
          label="Activity"
        />
        <SidebarItem
          to="/roadmap"
          icon={<GitPullRequest size={18} />}
          label="Roadmap"
        />

        <SidebarItem
          to="/work-packages"
          icon={<Clock size={18} />}
          label="Work packages"
          hasChildren={true}
          isOpen={openMenus.workPackages}
          toggleOpen={() => toggleMenu("workPackages")}
        />

        {openMenus.workPackages && (
          <div className="ml-8 space-y-1 mt-1">
            <NavLink
              to="/work-packages"
              className={({ isActive }) => `
                block px-4 py-2 text-sm rounded-md
                ${
                  isActive
                    ? "bg-primary-light/10 text-primary"
                    : "text-text-muted hover:bg-background"
                }
              `}
            >
              Assigned to me
            </NavLink>
            <NavLink
              to="/all"
              className={({ isActive }) => `
                block px-4 py-2 text-sm rounded-md
                ${
                  isActive
                    ? "bg-primary-light/10 text-primary"
                    : "text-text-muted hover:bg-background"
                }
              `}
            >
              All work packages
            </NavLink>
          </div>
        )}
        <SidebarItem to="/wiki" icon={<BookOpen size={18} />} label="Wiki" />
        <SidebarItem to="/news" icon={<FileText size={18} />} label="News" />
        <SidebarItem to="/members" icon={<Users size={18} />} label="Members" />
        <SidebarItem
          to="/settings"
          icon={<Settings size={18} />}
          label="Settings"
        />
      </div>
    </div>
  );
};

export default Sidebar;
