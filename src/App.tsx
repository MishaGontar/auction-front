import {lazy} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./pages/header/Header.tsx";
import PageProvider from "./pages/page/PageContext.tsx";
import SuspenseWithSpinner from "./components/suspense/SuspenseWithSpinner.tsx";

const Auctions = lazy(() => import("./pages/auction/Auctions.tsx"));
const Profile = lazy(() => import("./pages/user/Profile.tsx"));
const SellerForm = lazy(() => import("./pages/seller/SellerForm.tsx"));
const AdminLoginForm = lazy(() => import("./pages/auth/admin/AdminForm.tsx"));
const AuctionForm = lazy(() => import("./pages/auction/AuctionForm.tsx"));
const AuctionPage = lazy(() => import("./pages/auction/AuctionPage.tsx"));
const LotPage = lazy(() => import("./pages/lots/LotPage.tsx"));
const SellerProfile = lazy(() => import("./pages/seller/SellerProfile.tsx"));
const AdvanceAdminDashBoard = lazy(() => import("./pages/admin/AdvanceAdminDashBoard.tsx"));
const MainAuthPage = lazy(() => import("./pages/auth/MainAuthPage.tsx"));
const NotFound = lazy(() => import("./pages/error/NotFound.tsx"));


function App() {
    return (
        <PageProvider>
            <BrowserRouter>
                <Header/>
                <SuspenseWithSpinner>
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
                </SuspenseWithSpinner>
            </BrowserRouter>
        </PageProvider>
    )
}

export default App
