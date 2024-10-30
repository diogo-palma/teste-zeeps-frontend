import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/clients" className="text-white hover:text-gray-300">
            Clientes
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
