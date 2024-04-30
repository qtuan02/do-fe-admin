import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';
import logo from '@/public/assets/logo.png'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

interface Props {
    window?: () => Window;
    children?: React.ReactNode;
}

export default function Layout(props: Props) {
    const { window } = props;
    const { children } = props;
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [isCatalogCollapse, setIsCatalogCollapse] = React.useState(false);
    const [isCustomersCollapse, setIsCustomersCollapse] = React.useState(false);
    const [isOrdersCollapse, setIsOrdersCollapse] = React.useState(false);

    const handleCatalogCollapse = () => {
        setIsCatalogCollapse(!isCatalogCollapse);
    };

    const handleCustomersCollapse = () => {
        setIsCustomersCollapse(!isCustomersCollapse);
    };

    const handleOrdersCollapse = () => {
        setIsOrdersCollapse(!isOrdersCollapse);
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            <Toolbar>
                <Image src={logo} alt='logo' />
            </Toolbar>
            <Divider />
            <ul>
                <div>
                    <ListItem
                        disablePadding
                        className={pathname === '/dashboard' ? "text-sky-600 bg-slate-100" : ""}
                        onClick={() => { router.push('/dashboard') }}
                    >
                        <ListItemButton >
                            <ListItemIcon className={pathname === '/dashboard' ? "text-sky-600 bg-slate-100" : ""}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                </div>

                <div>
                    <ListItem
                        disablePadding
                        className={pathname.startsWith('/dashboard/category') ? "font-bold text-sky-600 bg-slate-100" : ""}
                        onClick={() => { router.push('/dashboard/category') }}
                    >
                        <ListItemButton>
                            <ListItemIcon className={pathname.startsWith('/dashboard/category') ? "text-sky-600 bg-slate-100" : ""}>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Categories List" />
                        </ListItemButton>
                    </ListItem>
                </div>

                <div>
                    <ListItem
                        disablePadding
                        className={pathname.startsWith('/dashboard/product') ? "font-bold text-sky-600 bg-slate-100" : ""}
                        onClick={() => { router.push('/dashboard/product') }}
                    >
                        <ListItemButton>
                            <ListItemIcon className={pathname.startsWith('/dashboard/product') ? "text-sky-600 bg-slate-100" : ""}>
                                <DevicesIcon />
                            </ListItemIcon>
                            <ListItemText primary="Products List" />
                        </ListItemButton>
                    </ListItem>
                </div>

                <div>
                    <ListItem
                        disablePadding
                        className={pathname.startsWith('/dashboard/customer') ? "font-bold text-sky-600 bg-slate-100" : ""}
                        onClick={() => { router.push('/dashboard/customer') }}
                    >
                        <ListItemButton>
                            <ListItemIcon className={pathname.startsWith('/dashboard/customer') ? "text-sky-600 bg-slate-100" : ""}>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Customers" />
                        </ListItemButton>
                    </ListItem>
                </div>

                <div>
                    <ListItem
                        disablePadding
                        className={pathname.startsWith('/dashboard/order') ? "font-bold text-sky-600 bg-slate-100" : ""}
                        onClick={() => { router.push('/dashboard/order') }}
                    >
                        <ListItemButton>
                            <ListItemIcon className={pathname.startsWith('/dashboard/order') ? "text-sky-600 bg-slate-100" : ""}>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Orders" />
                        </ListItemButton>
                    </ListItem>
                </div>
            </ul>

            <Divider />
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: "#FFFFFF",
                    color: "#2F2F2F"
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <main>{children}</main>
            </Box>
        </Box>
    );
}
