import AppLayout from "@/components/pages/app/layout";
import Home from "@/components/pages/home";
import SettingIndex from "@/components/pages/settings";
import TaskIndex from "@/components/pages/task";
import AppIndex from "@/components/pages/whiteboard";
import Whiteboard from "@/components/pages/whiteboard/whiteboard";
import { BrowserRouter, Routes, Route } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AppLayout />}>
          <Route path="/app" element={<AppIndex />} />
          <Route path="/app/task/:taskId" element={<TaskIndex type="Task" />} />
          <Route
            path="/app/project/:taskId"
            element={<TaskIndex type="Project" />}
          />
          <Route path="/app/settings" element={<SettingIndex />} />
        </Route>
        <Route path="/app/whiteboard/:id" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}
