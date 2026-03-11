import Sidebar from './Sidebar';

function Layout({ children }) {
    return (
        <div className="container">
            <Sidebar />
            {children}
        </div>
    );
}

export default Layout;