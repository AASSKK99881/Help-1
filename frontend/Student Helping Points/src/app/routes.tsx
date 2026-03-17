import { createBrowserRouter, Navigate } from "react-router";
import { StudentLayout } from "./layouts/StudentLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { StudentLogin } from "./pages/student/Login";
import { StudentHome } from "./pages/student/Home";
import { TaskDetail } from "./pages/student/TaskDetail";
import { CreateTask } from "./pages/student/CreateTask";
import { MyTasks } from "./pages/student/MyTasks";
import { Profile } from "./pages/student/Profile";
import { PointsHistory } from "./pages/student/PointsHistory";
import { Messages } from "./pages/student/Messages";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { ContentReview } from "./pages/admin/ContentReview";
import { ActivityManagement } from "./pages/admin/ActivityManagement";
import { SystemSettings } from "./pages/admin/SystemSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentHome /> },
      { path: "task/:id", element: <TaskDetail /> },
      { path: "create-task", element: <CreateTask /> },
      { path: "my-tasks", element: <MyTasks /> },
      { path: "profile", element: <Profile /> },
      { path: "points-history", element: <PointsHistory /> },
      { path: "messages", element: <Messages /> },
    ],
  },
  {
    path: "/login",
    element: <StudentLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <UserManagement /> },
      { path: "review", element: <ContentReview /> },
      { path: "activities", element: <ActivityManagement /> },
      { path: "settings", element: <SystemSettings /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
