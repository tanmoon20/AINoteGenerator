import React, {useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { Button as AwsButton} from "@aws-amplify/ui-react";
import WhiteLogo from "../assets/images/logos/xtremelogowhite.png";
import { Auth } from "aws-amplify";
import { MyContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import userAvatar from '../assets/images/users/user1.jpg'

const Header = () => {

  const { user, setUser } = useContext(MyContext);
  const navigate = useNavigate();

  // rerender the header on signin or signout
  useEffect(() => {}, [user]);

  // sign out function
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      navigate('/starter');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };


  return (
    <Navbar className="white" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" >
          <img src={WhiteLogo} className="img-fluid" alt="WhiteLogo" style={{width: '150px', height: 'auto'}}/>
        </NavbarBrand>
      </div>
      <div className="hstack gap-2 justify-content-start">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        {user !== null && <AwsButton onClick={handleSignOut}>SignOut</AwsButton> }
        
        <Nav className="ms-auto" navbar>
          <NavItem>
            <Link to="/starter" className="nav-link">
             <span style={{ fontSize: '20px' }}> Home </span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/about" className="nav-link">
              <span style={{ fontSize: '20px' }}> About </span>
            </Link>
          </NavItem>
          
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              <span style={{ fontSize: '20px' }}> DD Menu </span>
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <NavItem>
            <Link to="/premium" className="nav-link">
              <Button className="btn" color="primary" size="sm">
                  Upgrade to Premium
              </Button>
            </Link>
          </NavItem>

          {user === null && 
            <NavItem>
              <Link to="/login" className="nav-link">
                <img src={userAvatar} alt="Blank Avatar" className="rounded-circle" style={{ width: '35px', height: '35px' }} />
              </Link>
            </NavItem>
          }

        </Nav>

        {/* <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="primary">
            <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>My Balance</DropdownItem>
            <DropdownItem>Inbox</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown> */}

      </Collapse>
    </Navbar>
  );
};

export default Header;
