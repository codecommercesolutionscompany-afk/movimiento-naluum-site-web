
import PropTypes from 'prop-types';
import './header.scss';

const Header = ({ children }) => {
    return (
        <header className='header__container'>
            <div className='header__content'>
                { children }
            </div>
        </header>
    );
};

Header.propTypes = {
    children: PropTypes.node,
};

export default Header;
