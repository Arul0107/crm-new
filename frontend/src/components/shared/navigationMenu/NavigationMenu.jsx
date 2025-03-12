import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from "react-perfect-scrollbar";
import Menus from './Menus';
import { NavigationContext } from '../../../contentApi/navigationProvider';

const NavigationManu = () => {
    const { navigationOpen, setNavigationOpen } = useContext(NavigationContext);
    const pathName = useLocation().pathname;

    useEffect(() => {
        setNavigationOpen(false); // Close menu when route changes
    }, [pathName, setNavigationOpen]);

    return (
        <nav className={`nxl-navigation ${navigationOpen ? "mob-navigation-active" : ""}`}>
            <div className="navbar-wrapper">
                <div className="m-header">
                    <Link to="/" className="b-brand">
                        <img src="/images/logo-full1.png" alt="logo" className="logo logo-lg" style={{ width: "100%" }} />
                        <img src="/images/Acculer/Submark Logo 01.png" alt="logo" className="logo logo-sm" />
                    </Link>
                </div>

                <div className="navbar-content">
                    <PerfectScrollbar>
                        <ul className="nxl-navbar">
                            <li className="nxl-item nxl-caption">
                                <label>Navigation</label>
                            </li>
                            <Menus />
                        </ul>
                        <div style={{ height: "18px" }}></div>
                    </PerfectScrollbar>
                </div>
            </div>

            {/* Close menu when clicking outside */}
            {navigationOpen && (
                <div className="nxl-menu-overlay" onClick={() => setNavigationOpen(false)}></div>
            )}
        </nav>
    );
};

export default NavigationManu;
