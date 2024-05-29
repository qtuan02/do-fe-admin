"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import { AppstoreOutlined, BulbOutlined, DashboardOutlined, ExportOutlined, PlusOutlined, ShoppingCartOutlined, TabletOutlined, UserOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface Props {
    children?: React.ReactNode;
}

export default function NavbarLayout(props: Props) {
    const { children } = props;
    const [role, setRole] = useState("");
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    useEffect(() => {
        getRole();
    }, [role]);

    const handleLogout = async () => {
        Cookies.remove('token');
        window.location.replace('/login');
    };

    const getRole = async () => {
        const token = await Cookies.get("token") as string;
        const decoded: any = await jwtDecode(token);
        setRole(decoded.role);
    };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="w-full bg-black shadow-md flex items-center justify-between p-4 text-white h-20">
                <div className="text-2xl font-bold">ADMIN DASHBOARD</div>
                <div className="flex items-center space-x-4">
                <DropdownButton variant='info' title={<span className="uppercase">{role}</span>}>
                    <Dropdown.Item href='/dashboard/profile'>Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </DropdownButton>
                </div>
            </header>

            <div className="flex flex-row flex-grow">
                {isSidebarVisible && (
                    <div className="w-1/5 bg-slate-300 overflow-hidden shadow-lg">
                        <Nav defaultActiveKey="/dashboard" className="flex flex-col py-4">
                            <Link href="/dashboard" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <DashboardOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Dashboard</span>
                                </span>
                            </Link>
                            <Link href="/dashboard/category" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <AppstoreOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Categories</span>
                                </span>
                            </Link>
                            <Link href="/dashboard/brand" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <BulbOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Brands</span>
                                </span>
                            </Link>
                            <Link href="/dashboard/product" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <TabletOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Products</span>
                                </span>
                            </Link>
                            <Link href="/dashboard/user" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <UserOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Users</span>
                                </span>
                            </Link>
                            <Link href="/dashboard/order" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Orders</span>
                                </span>
                            </Link>
                            <hr />
                            <Link href="/dashboard/product/add" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                                <span className="flex items-center space-x-2">
                                    <PlusOutlined style={{ fontSize: '24px' }} />
                                    <span className="text-lg font-semibold">Add Product</span>
                                </span>
                            </Link>
                        </Nav>
                    </div>
                )}
                <div className="bg-white border-none">
                    <Button variant="light" onClick={toggleSidebar} className="p-2">
                        {isSidebarVisible ? <CloseOutlined style={{ fontSize: '18px' }} /> : <MenuOutlined style={{ fontSize: '18px' }} />}
                    </Button>
                </div>

                <main className={`flex-grow p-5 bg-white ${isSidebarVisible ? 'w-4/5' : 'w-full'}`}>
                    {children}
                </main>
            </div>
        </div>
    )
}
