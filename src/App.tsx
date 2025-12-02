import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login.tsx";
import {MainLayout} from "@/layouts/MainLayout.tsx";
import Dashboard from "@/pages/Dashboard.tsx";

function App() {
  return (
      <>
          <Router>
              <Routes>
                  <Route path="/dang-nhap" element={<Login/>}/>

                  <Route path="/" element={<MainLayout/>}>
                      <Route index element={<Dashboard/>}/>
                      <Route path="/quan-ly-tin-dang" element={<p>Quan ly tin dang</p>}/>
                      <Route path="/quan-ly-nguoi-dung" element={<p>Quan ly nguoi dung</p>}/>
                      <Route path="/quan-ly-bo-uu-tien" element={<p>Quan ly bo uu tien</p>}/>
                  </Route>
              </Routes>
          </Router>
      </>
  )
}

export default App
