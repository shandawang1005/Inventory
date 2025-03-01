import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ padding: "10px", background: "#282c34", color: "white" }}>
            <ul style={{ display: "flex", listStyle: "none", gap: "20px" }}>
                <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
                <li><Link to="/products" style={{ color: "white", textDecoration: "none" }}>Products</Link></li>
                <li><Link to="/sales" style={{ color: "white", textDecoration: "none" }}>Sales</Link></li>
                <li><Link to="/reports" style={{ color: "white", textDecoration: "none" }}>Reports</Link></li>
                <li><Link to="/settings" style={{ color: "white", textDecoration: "none" }}>Settings</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
