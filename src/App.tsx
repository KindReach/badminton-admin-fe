import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import { setLogin } from "./state/login/login";
import Login from "@pages/Login/Login";
import Loading from "./components/Loading/Loading";
import { setLoading } from "./state/loading/loading";
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

function App() {
  const loginState = useSelector((state: RootState) => state.login.isLogin);
  const loadingState = useSelector(
    (state: RootState) => state.loading.isLoading,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setLogin(true));
      } else {
        dispatch(setLogin(false));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  if (!loginState)
    return (
      <BrowserRouter>
        {loadingState && <Loading />}
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );

  return (
    <BrowserRouter>
      {loadingState && <Loading />}

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
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
