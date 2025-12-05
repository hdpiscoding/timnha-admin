import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login.tsx";
import {MainLayout} from "@/layouts/MainLayout.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import PropertyManagement from "@/pages/PropertyManagement.tsx";
import UserManagement from "@/pages/UserManagement.tsx";
import PreferencePresetManagement from "@/pages/PreferencePresetManagement.tsx";
import {PrivateRoute} from "@/components/private-route.tsx";
import CreatePreferencePreset from "@/pages/CreatePreferencePreset.tsx";
import EditPreferencePreset from "@/pages/EditPreferencePreset.tsx";

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
                      <Route path="/tin-dang" element={<PropertyManagement />} />
                      <Route path="/nguoi-dung" element={<UserManagement />} />
                      <Route path="/bo-uu-tien" element={<PreferencePresetManagement />} />
                      <Route path="/bo-uu-tien/tao-moi" element={<CreatePreferencePreset />} />
                      <Route path="/bo-uu-tien/:id/chinh-sua" element={<EditPreferencePreset />} />
                  </Route>
              </Routes>
          </Router>
      </>
  )
}

export default App
