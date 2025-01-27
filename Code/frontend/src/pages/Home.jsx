import { NavLink } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    return (
        <div className="main_container">
            <div className="hellohome container-fluid">
                <h1>
                    We are coming with <span> new opportunities!</span>
                </h1>
                <p>
                    It is a long established fact that the <br />
                    learners will be upskilled here!
                </p>

                <button>
                    <NavLink to="/about" className="btn btn-primary">
                        Learn More
                    </NavLink>
                </button>
            </div>

            <div className="container-fluid chooseus">
                <h1>
                    <span>Why </span>Choose Us
                </h1>
                <p>
                    Best Way of Learning is Participation. So participate in
                    different kinds of contributions
                </p>
            </div>
            <div className="container main_content">
                We are the community of developers, designers, creators, and
                learners. We server you with best of our knowledge and
                experience. You can also be a part of our community and share
                your knowledge and experience with us. We help each other in
                project development, problem solving, and learning new
                technologies in exchange of some incentives or credits!
                <div className="glowit">
                    <h1>REGISTER WITH US:</h1>
                    You can take help from our community by registering as a
                    client and help other to earn credits by registering as a
                    SPARKY!
                </div>
            </div>
        </div>
    );
};

export default Home;
