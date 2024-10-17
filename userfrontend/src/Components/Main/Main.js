import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faEdit, faUser, faSearch, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from './Main.module.css';
import FeedPage from '../FeedPage/FeedPage';

function Main() {
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <img src="/aviquelogo.jpg" alt="Avique Logo" className={styles.logo} />
                </div>
                <div className={styles.navLinks}>
                    <Link to='/profile' className={styles.navLink}>
                        <FontAwesomeIcon icon={faUserCircle} />
                    </Link>
                    <Link to='/userposts' className={styles.navLink}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link to='/friends-request' className={styles.navLink}>
                        <FontAwesomeIcon icon={faUsers} />
                    </Link>
                    <Link to='/search' className={styles.navLink}>
                        <FontAwesomeIcon icon={faSearch} />
                    </Link>
                </div>
            </nav>

            <div className={styles.friendListContainer}>
                <FeedPage />
            </div>
        </div>


    );
}

export default Main;
