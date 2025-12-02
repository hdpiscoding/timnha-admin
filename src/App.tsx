import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login.tsx";
import {MainLayout} from "@/layouts/MainLayout.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import PropertyManagement from "@/pages/PropertyManagement.tsx";
import UserManagement from "@/pages/UserManagement.tsx";
import PreferencePresetManagement from "@/pages/PreferencePresetManagement.tsx";

function App() {
  return (
      <>
          <Router>
              <Routes>
                  <Route path="/dang-nhap" element={<Login/>}/>

                  <Route path="/" element={<MainLayout/>}>
                      <Route index element={<Dashboard/>}/>
                      <Route path="/quan-ly-tin-dang" element={<PropertyManagement/>}/>
                      <Route path="/quan-ly-nguoi-dung" element={<UserManagement/>}/>
                      <Route path="/quan-ly-bo-uu-tien" element={<PreferencePresetManagement/>}/>
                  </Route>
              </Routes>
          </Router>
      </>
  )
}

export default App
