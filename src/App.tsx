import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login.tsx";
import {MainLayout} from "@/layouts/MainLayout.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import PropertyManagement from "@/pages/PropertyManagement.tsx";
import UserManagement from "@/pages/UserManagement.tsx";
import PreferencePresetManagement from "@/pages/PreferencePresetManagement.tsx";
import {PrivateRoute} from "@/components/private-route.tsx";

function App() {
  return (
      <>
          <Router>
              <Routes>
                  <Route path="/dang-nhap" element={<Login />} />

                  <Route path="/" element={<Navigate to="/dang-nhap" replace />} />

                  <Route
                      element={
                          <PrivateRoute>
                              <MainLayout />
                          </PrivateRoute>
                      }
                  >
                      <Route path="/bang-dieu-khien" element={<Dashboard />} />
                      <Route path="/quan-ly-tin-dang" element={<PropertyManagement />} />
                      <Route path="/quan-ly-nguoi-dung" element={<UserManagement />} />
                      <Route path="/quan-ly-bo-uu-tien" element={<PreferencePresetManagement />} />
                  </Route>
              </Routes>
          </Router>
      </>
  )
}

export default App
