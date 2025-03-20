import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import Login from "@pages/Login/Login";
import { setLogin } from "./state/login/login";
import Loading from "./components/Loading/Loading";
import Loading2 from "./components/Loading2/Loading2";
import { setLoading1 } from "./state/loading/loading";
import BookDetail from "./pages/BookDetail/BookDetail";
import Signed from "./pages/Signed/Signed";
import Books from "./pages/Books/Books";
import SignList from "./pages/SignList/SignList";
import Members from "./pages/Members/Members";
import Setting from "./pages/Setting/Setting";
import Create from "./pages/Create/Create";
import TeamName from "./pages/Setting/components/TeamName/TeamName";
import Location from "./pages/Setting/components/Location/Location";
import Pricing from "./pages/Setting/components/Pricing/Pricing";
import PrivateRules from "./pages/Setting/components/PrivateRules/PrivateRules";
import Modals from "./components/Modal/Modal";
import Line from "./pages/Setting/components/Line/Line";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
  const loginState = useSelector((state: RootState) => state.login.isLogin);
  const loadingState = useSelector(
    (state: RootState) => state.loading,
  );
  const modalState = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading1(true));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setLogin(true));
      } else {
        dispatch(setLogin(false));
      }
      dispatch(setLoading1(false));
    });

    return () => unsubscribe();
  }, []);

  if (!loginState)
    return (
      <BrowserRouter>
        {loadingState.isLoading1 && <Loading />}
        {loadingState.isLoading2 && <Loading2 />}
        {modalState.show && <Modals />}
        
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/reset_password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    );

  return (
    <BrowserRouter>
      { loadingState.isLoading1 && <Loading />}
      { loadingState.isLoading2 && <Loading2 />}
      {modalState.show && <Modals />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<BookDetail />} />
        <Route path="/create" element={<Create />} />
        <Route path="/members" element={<Members />} />
        <Route path="/books" element={<Books />} />
        <Route path="/signed" element={<Signed />} />
        <Route path="/signlist" element={<SignList />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/setting/team_name" element={<TeamName />} />
        <Route path="/setting/location" element={<Location />} />
        <Route path="/setting/pricing" element={<Pricing />} />
        <Route path="/setting/private_rules" element={<PrivateRules />} />
        <Route path="/setting/line" element={<Line />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
