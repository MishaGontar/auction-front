import Header from "./components/header/Header.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Auctions from "./components/auction/Auctions.tsx";
import Profile from "./components/user/Profile.tsx";
import SellerForm from "./components/seller/SellerForm.tsx";
import AdminLoginForm from "./components/admin/AdminForm.tsx";
import AuctionForm from "./components/auction/AuctionForm.tsx";
import AuctionPage from "./components/auction/AuctionPage.tsx";
import LotPage from "./components/lots/LotPage.tsx";
import SellerProfile from "./components/seller/SellerProfile.tsx";
import AdvanceAdminDashBoard from "./components/admin/AdvanceAdminDashBoard.tsx";
import MainAuthPage from "./components/auth/MainAuthPage.tsx";
import NotFound from "./components/NotFound.tsx";
import PageProvider from "./components/page/PageContext.tsx";

function App() {
    return (
        <PageProvider>
            <BrowserRouter>
                <Header/>
                <Routes>
                    {/*NO AUTH ROUTER*/}
                    <Route path='/' element={<Auctions/>}/>
                    <Route path='/auctions' element={<Auctions/>}/>
                    <Route path='/login' element={<MainAuthPage/>}/>
                    <Route path='/auction/:id' element={<AuctionPage/>}/>
                    <Route path='/auction/lot/:id' element={<LotPage/>}/>
                    <Route path='/seller/:id' element={<SellerProfile/>}/>

                    {/* WITH AUTH ROUTER*/}
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/become.seller' element={<SellerForm/>}/>

                    {/*FOR SELLERS*/}
                    <Route path='/create/auction' element={<AuctionForm/>}/>

                    {/*ADMIN ROUTER*/}
                    <Route path='/admin/login' element={<AdminLoginForm/>}/>
                    <Route path='/admin/dashboard' element={<AdvanceAdminDashBoard/>}/>

                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </PageProvider>
    )
}

export default App
