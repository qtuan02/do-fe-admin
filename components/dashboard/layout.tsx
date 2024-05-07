import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/assets/logo.png'
import { AppstoreOutlined } from '@ant-design/icons'

interface Props {
    children?: React.ReactNode;
}

const Layout = (props: Props) => {
    const { children } = props;

    return (
        <>
            <div className="min-h-screen flex flex-row bg-gray-100">
                <div className="flex flex-col w-56 bg-white rounded-r-3xl overflow-hidden">
                    <div className="flex items-center justify-center h-20 shadow-md">
                        <Image src={Logo} alt="Logo" />
                    </div>
                    <ul className="flex flex-col py-4">
                        <li>
                            <Link href="/dashboard">
                                <div
                                    className='flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800'
                                >
                                    <span className='inline-flex items-center justify-center h-12 w-12 text-lg'><AppstoreOutlined /></span>
                                    <span className="text-sm font-medium">Dashboard</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/category">
                                <div
                                    className='flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800'                              >
                                    <span className='inline-flex items-center justify-center h-12 w-12 text-lg text-gray-500'></span>
                                    <span className="text-sm font-medium">Categorise List</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/product">
                                <div
                                    className='flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800'                              >
                                    <span className='inline-flex items-center justify-center h-12 w-12 text-lg text-gray-500'></span>
                                    <span className="text-sm font-medium">Products List</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/customer">
                                <div
                                    className='flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800'                              >
                                    <span className='inline-flex items-center justify-center h-12 w-12 text-lg text-gray-500'></span>
                                    <span className="text-sm font-medium">Customers</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/order">
                                <div
                                    className='flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800'                              >
                                    <span className='inline-flex items-center justify-center h-12 w-12 text-lg text-gray-500'></span>
                                    <span className="text-sm font-medium">Orders</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <main className="flex-grow m-5">{children}</main>
            </div>
        </>
    )
}

export default Layout;
