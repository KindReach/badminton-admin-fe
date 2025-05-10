import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
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
import SignedUp from "./pages/SIgnedUp/SignedUp";
import { apiPrefix } from "@/utils/firebase";
import axios from "axios";
import { ModalLevel, setModalShow, setModalState } from "./state/modal/modal";

function App() {
  const loginState = useSelector((state: RootState) => state.login.isLogin);
  const loadingState = useSelector(
    (state: RootState) => state.loading,
  );
  const modalState = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  /**
   * @This function is used to check if the user has set up the default location or not.
   */
  const checkUserLocation = async (user: User) => {
          
    try {
      const idToken = await user.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/setting/defaultData`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
      
      if ( !data["default_region"] ) {
        dispatch(setModalState({
          message: "請先設定預設地點 ( 設定 > 場地資訊設定 )",
          title: "尚未設定預設地點",
          level: ModalLevel.WARNING,
        }));
        dispatch(setModalShow(true));
      }

    } catch ( err ) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    }
  }

  useEffect(() => {
    dispatch(setLoading1(true));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setLogin(true));
        // Check if the user has set up the default location
        checkUserLocation(user);
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
          <Route path="/signedup" element={<SignedUp />} />
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
        <Route path="/signedup" element={<SignedUp />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
