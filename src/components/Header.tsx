import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/react";
import {ColorTypeSecond,} from "../utils/CustomUtils.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../constans.ts";
import {useAuth} from "../provider/AuthProvider.tsx";
import {
    getAdminToken,
    getAuthConfig,
    getAuthToken,
    removeAdminToken,
    removeAuthToken,
    removeMfaToken
} from "../utils/TokenUtils.ts";

interface IMenuItem {
    color: ColorTypeSecond,
    href: string,
    name: string,
    disabled?: boolean
}

const adminMenuItem: IMenuItem = {
    color: 'foreground',
    href: '/admin/dashboard',
    name: 'Admin dashboard'
}

const sellerMenuItem: IMenuItem = {
    color: 'foreground',
    href: '/create/auction',
    name: 'Create auction'
}
const initMenu: IMenuItem = {
    color: 'foreground',
    href: '/auctions',
    name: 'Auctions'
}
export default function Header() {
    const navigator = useNavigate()
    const {user, login, logout} = useAuth()

    const isLogin = getAuthToken()
    const isAdmin = getAdminToken()
    const isSeller = isLogin && (user?.status_name === "accepted")


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([initMenu])

    useEffect(() => {
        if (isAdmin) {
            ifNotExistPush("/admin/dashboard", adminMenuItem)
        }
        if (isSeller) {
            ifNotExistPush("/create/auction", sellerMenuItem)
        }
    }, [isSeller, isAdmin, user]);

    useEffect(() => {
        if (!isLogin) {
            return;
        }

        if (user) {
            return;
        }

        axios.get(`${SERVER_URL}/user`, getAuthConfig())
            .then(response => {
                login(response.data)
            })
            .catch(e => console.error(e))
    }, [isLogin, login, user])

    function ifNotExistPush(url: string, menuItem: IMenuItem) {
        setMenuItems(prevState => {
            if (menuItems.find(m => m.href.includes(url))) {
                return prevState
            }
            return [...prevState, menuItem]
        })
    }

    function logOut() {
        removeAuthToken()
        removeMfaToken()
        removeAdminToken()
        setMenuItems([initMenu])
        logout()
        navigator('/auctions')
    }

    return (<Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarContent className="hidden sm:flex gap-4 my-1.5">
                    {menuItems.map((item, key) => (<>
                        <NavbarItem key={key}>
                            <Link isDisabled={item.disabled}
                                  color={item.color}
                                  href={item.href}
                            >
                                {item.name}
                            </Link>
                        </NavbarItem>
                    </>))
                    }
                </NavbarContent>
            </NavbarContent>
            {!isLogin && <NavbarContent as="div" justify="end">
                <Button color="primary"
                        variant="bordered"
                        as="div"
                        onClick={() => navigator('/login')}>
                    Login
                </Button>
            </NavbarContent>}
            {isLogin && <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            size="sm"
                            src={`${SERVER_URL}${user?.image_url}`}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile"
                                      href="/profile"
                                      className="h-10 gap-2">
                            <p className="font-semibold"> Signed in as {user?.username} </p>
                        </DropdownItem>
                        <DropdownItem key="settings"
                                      onClick={()=>navigator('/profile')}>
                            My Profile
                        </DropdownItem>
                        <DropdownItem key="settings"
                                      href={`/seller/${user?.seller_id}`}
                                      className={isSeller ? '' : 'hidden'}
                        >
                            My Seller Profile
                        </DropdownItem>
                        <DropdownItem key="become_seller"
                                      href="/become.seller"
                                      color="secondary"
                                      className={isSeller || user?.seller_id ? 'hidden' : ''}
                        >
                            Become a seller
                        </DropdownItem>
                        <DropdownItem key="logout"
                                      color="danger"
                                      onClick={logOut}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>}
            <NavbarMenu className="flex items-center">
                {menuItems.map((menuItem, index) => (
                    <NavbarMenuItem key={`${menuItem.name}-${index}`} className="my-1.5 "
                                    isActive={window.location.href.includes(menuItem.href)}
                    >
                        <Link
                            color={menuItem.color}
                            className="w-full"
                            href={menuItem.href}
                            size="lg"
                        >
                            {menuItem.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}