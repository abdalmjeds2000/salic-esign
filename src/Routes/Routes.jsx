import { Spinner } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
// import ESignDocument from '../pages/ESignDocument';
// import File404 from "../pages/File404";
// import OTP from "../pages/OTP";


const ESignDocument = React.lazy(() => import("../pages/ESignDocument"));
const File404 = React.lazy(() => import("../pages/File404"));
const OTP = React.lazy(() => import("../pages/OTP"));


const AppRoutes = () => {
  const { isAllowShowDoc } = useStateContext();
  return (
    <Suspense fallback={<div className="flex justify-center mt-14"><Spinner size='xl' /></div>}>
      <Routes>
        <Route path='/' element={<Navigate to="/file" />} />
        <Route path='/file' element={isAllowShowDoc ? <ESignDocument /> : <Navigate to="/request-access" replace={true} />} />
        <Route path='/404-file' element={<File404 />} />
        <Route path='/request-access' element={isAllowShowDoc ? <Navigate to="/file" replace={true} /> : <OTP />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;
