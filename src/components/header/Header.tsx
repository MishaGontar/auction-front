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
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {useAuth} from "../../provider/AuthProvider.tsx";
import {getAdminToken, getAuthConfig, getAuthToken} from "../../utils/TokenUtils.ts";
import {adminMenuItem, IMenuItem, initMenu, sellerMenuItem} from "./MenuItem.ts";

export default function Header() {
    const navigator = useNavigate()
    const {user, login, logout} = useAuth()

    const isLogin = getAuthToken()
    const isAdmin = getAdminToken()
    const isSeller = isLogin && (user?.status_id === 2)

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
        axios.get(`/user`, getAuthConfig())
            .then(response => login(response.data))
            .catch(e => {
                if (e.response.status === 403 || e.response.status === 400) {
                    logout()
                }
            })
    }, [window.location.href])

    function ifNotExistPush(url: string, menuItem: IMenuItem) {
        setMenuItems(prevItems => {
            if (prevItems.some((item) => item.href.includes(url))) {
                return prevItems;
            }
            return [...prevItems, menuItem];
        })
    }

    function logOut() {
        setMenuItems([initMenu])
        logout()
        navigator('/auctions')
    }

    return (
        <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarContent className="hidden sm:flex gap-4 my-1.5">
                    {menuItems.map((item, key) => (
                        <NavbarItem key={key}>
                            <Link isDisabled={item.disabled}
                                  color={item.color}
                                  href={item.href}
                            >
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </NavbarContent>
            {!isLogin && (
                <NavbarContent as="div" justify="end">
                    <Button color="primary"
                            variant="bordered"
                            as="div"
                            onClick={() => navigator('/login')}>
                        Увійти
                    </Button>
                </NavbarContent>
            )}
            {isLogin && (
                <NavbarContent as="div" justify="end">
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
                                          onTouchEnd={() => navigator('/profile')}
                                          onClick={() => navigator(`/profile`)}
                                          className="h-10 gap-2">
                                <p className="font-semibold"> Увійшли як {user?.username} </p>
                            </DropdownItem>
                            <DropdownItem key="settings"
                                          onTouchEnd={() => navigator('/profile')}
                                          onClick={() => navigator('/profile')}>
                                Мій особистий профіль
                            </DropdownItem>
                            <DropdownItem key="seller_profile"
                                          onTouchEnd={() => navigator(`/seller/${user?.seller_id}`)}
                                          onClick={() => navigator(`/seller/${user?.seller_id}`)}
                                          className={isSeller ? '' : 'hidden'}
                            >
                                Профіль продавця
                            </DropdownItem>
                            <DropdownItem key="become_seller"
                                          onTouchEnd={() => navigator('/become.seller')}
                                          onClick={() => navigator('/become.seller')}
                                          color="secondary"
                                          className={isSeller || user?.seller_id ? 'hidden' : ''}
                            >
                                Стати продавцем
                            </DropdownItem>
                            <DropdownItem key="logout"
                                          color="danger"
                                          onTouchEnd={logOut}
                                          onClick={logOut}>
                                Вийти з акаунта
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            )}
            <NavbarMenu className="flex items-center">
                {menuItems.map((menuItem, index) => (
                    <NavbarMenuItem key={index} className="my-1.5"
                                    isActive={window.location.href.includes(menuItem.href)}>
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