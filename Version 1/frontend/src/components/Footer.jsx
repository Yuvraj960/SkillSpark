import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="container-fluid">
      <div className="footer__container">
        <div className="footer__social">
          <FaFacebook />
          <FaXTwitter />
          <FaInstagram />
          <FaLinkedin />
        </div>

        <div className="footer__items container">
          <div className="contact_us footer__card">
            <h1>CONTACT US</h1>
            <p>
              123 Second Street Fifth Avenue, Manhattan, New York +987 654 3210
            </p>
          </div>
          <div className="addlinks footer__card">
            <h1>ADDITIONAL LINKS</h1>
            <ul>
              <li>
                <Link to={`/about`}>About</Link>
              </li>
              <li>
                <Link to={`/about`}>Terms and Conditions</Link>
              </li>
              <li>
                <Link to={`/about`}>Privacy Policy</Link>
              </li>
              {/* <li>
                <Link to={`/opportunities`}>Opportunities</Link>
              </li> */}
              <li>
                <Link to={`/contact`}>Contact Us</Link>
              </li>
            </ul>
          </div>
          {/* <div className="serv footer__card">
            <h1>OPPORTUNITIES</h1>
            <ul>
              <li>
                <Link to={`/opportunities`}>Interships</Link>
              </li>
              <li>
                <Link to={`/opportunities`}>Projects</Link>
              </li>
              <li>
                <Link to={`/opportunities`}>Services</Link>
              </li>
              <li>
                <Link to={`/opportunities`}>Free Resources</Link>
              </li>
              <li>
                <Link to={`/opportunities`}>Placements</Link>
              </li>
            </ul>
          </div> */}
          <div className="abt footer__card">
            <h1>ABOUT SKILLSPARK</h1>
            <p>
              Interactive platform where people can find the Best Internship opportunities
            </p>
          </div>
        </div>
      </div>

      <div className="footer__copyright">
        Copyright 2025 All Right Reserved By{" "}
        <a href="https://github.com/Yuvraj960">Yuvraj960</a>
      </div>
    </div>
  );
};

export default Footer;
