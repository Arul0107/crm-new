import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { menuList } from "@/utils/fackData/menuList";
import getIcon from "@/utils/getIcon";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null); // Open main menu
    const [openSubDropdown, setOpenSubDropdown] = useState(null); // Open sub-menu
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const pathName = useLocation().pathname;

    const handleMainMenu = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name)); // Toggle single menu
        setOpenSubDropdown(null); // Close any open sub-dropdown
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        setOpenSubDropdown((prev) => (prev === name ? null : name)); // Toggle sub-dropdown
    };

    useEffect(() => {
        if (pathName !== "/") {
            const x = pathName.split("/");
            setActiveParent(x[1]);
            setActiveChild(x[2]);
            setOpenDropdown(x[1]);
            setOpenSubDropdown(x[2]);
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName]);

    return (
        <>
            {menuList.map(({ dropdownMenu, id, name, path, icon }) => (
                <li
                    key={id}
                    onClick={() => handleMainMenu(name)}
                    className={`nxl-item nxl-hasmenu ${activeParent === name ? "active nxl-trigger" : ""}`}
                >
                    <Link to={path} className="nxl-link text-capitalize">
                        <span className="nxl-micon">{getIcon(icon)}</span>
                        <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>{name}</span>
                        <span className="nxl-arrow fs-16">
                            <FiChevronRight />
                        </span>
                    </Link>

                    <ul className={`nxl-submenu ${openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}>
                        {dropdownMenu.map(({ id, name, path, subdropdownMenu }) => (
                            <Fragment key={id}>
                                {subdropdownMenu.length ? (
                                    <li
                                        className={`nxl-item nxl-hasmenu ${activeChild === name ? "active" : ""}`}
                                        onClick={(e) => handleDropdownMenu(e, name)}
                                    >
                                        <Link to={path} className="nxl-link text-capitalize">
                                            <span className="nxl-mtext">{name}</span>
                                            <span className="nxl-arrow">
                                                <FiChevronRight />
                                            </span>
                                        </Link>

                                        <ul className={`nxl-submenu ${openSubDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}>
                                            {subdropdownMenu.map(({ id, name, path }) => (
                                                <li key={id} className={`nxl-item ${pathName === path ? "active" : ""}`}>
                                                    <Link className="nxl-link text-capitalize" to={path}>
                                                        {name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ) : (
                                    <li className={`nxl-item ${pathName === path ? "active" : ""}`}>
                                        <Link className="nxl-link" to={path}>
                                            {name}
                                        </Link>
                                    </li>
                                )}
                            </Fragment>
                        ))}
                    </ul>
                </li>
            ))}
        </>
    );
};

export default Menus;
