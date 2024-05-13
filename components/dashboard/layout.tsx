"use client"
import Link from 'next/link';
import { Button, Nav } from 'react-bootstrap';
import { AppstoreOutlined, BulbOutlined, DashboardOutlined, ExportOutlined, PlusOutlined, ShoppingCartOutlined, TabletOutlined, UserOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie';

interface Props {
    children?: React.ReactNode;
}

const NavbarLayout = (props: Props) => {
    const { children } = props;

    const handleLogout = async () => {
        Cookies.remove('token');
        window.location.replace('/login');
    };

    return (
        <div className="min-h-screen flex flex-row bg-gray-100">
            <div className="flex flex-col w-72 bg-white rounded-r-3xl overflow-hidden shadow-lg">
                <div className="flex items-center justify-center h-24 text-black">
                    <h1 className="text-3xl font-bold">ADMIN</h1>
                </div>
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
                            <span className="text-lg font-semibold">Category List</span>
                        </span>
                    </Link>
                    <Link href="/dashboard/brand" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                        <span className="flex items-center space-x-2">
                            <BulbOutlined style={{ fontSize: '24px' }} />
                            <span className="text-lg font-semibold">Brand List</span>
                        </span>
                    </Link>
                    <Link href="/dashboard/product" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                        <span className="flex items-center space-x-2">
                            <TabletOutlined style={{ fontSize: '24px' }} />
                            <span className="text-lg font-semibold">Product List</span>
                        </span>
                    </Link>
                    <Link href="/dashboard/customer" className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 rounded-md text-decoration-none text-dark">
                        <span className="flex items-center space-x-2">
                            <UserOutlined style={{ fontSize: '24px' }} />
                            <span className="text-lg font-semibold">Customers</span>
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
                            <PlusOutlined  style={{ fontSize: '24px' }} />
                            <span className="text-lg font-semibold">Add Product</span>
                        </span>
                    </Link>
                    <hr />
                    <br />
                    <Button variant='danger' className="px-6 py-3 flex items-center space-x-4 hover:bg-gray-200 text-decoration-none text-dark" onClick={() => handleLogout()}>
                        <span className="flex items-center space-x-2">
                            <ExportOutlined  style={{ fontSize: '24px' }} />
                            <span className="text-lg font-semibold">LOG OUT</span>
                        </span>
                    </Button>
                </Nav>
            </div>
            <main className="flex-grow m-5">{children}</main>
        </div>
    )
}

export default NavbarLayout;
