import "../styles/FAQ.css";

const FAQ = () => {
    return (
        <div>
            <section className="intro">
                <h2>Welcome to FAQ</h2>
                <p>
                    Here you can find answers to some of the most commonly asked
                    questions about our micro-collaboration platform. If you
                    need further assistance, feel free to get in touch.
                </p>
            </section>

            <section className="faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-item">
                    <h3>What is SkillSpark?</h3>
                    <p>
                        SkillSpark is a platform designed for
                        micro-collaboration, connecting professionals across the
                        globe to work on short-term projects.
                    </p>
                </div>
                <div className="faq-item">
                    <h3>How can I get started?</h3>
                    <p>
                        Simply sign up on our platform, create a profile, and
                        start browsing available micro-projects or post your
                        own!
                    </p>
                </div>
                <div className="faq-item">
                    <h3>How does payment work?</h3>
                    <p>
                        Payments are processed directly between the client and sparky.
                        Both freelancers and clients can set terms, and payments
                        are released upon task completion. Their is no intereference from SkillSpark.
                    </p>
                </div>
                <div className="faq-item">
                    <h3>Is SkillSpark free to use?</h3>
                    <p>
                        Yes, SkillSpark is free to use for both freelancers and
                        clients upto a certain limit. We will offer a premium membership with added
                        benefits, such as free resources and advanced project management tools.
                    </p>
                </div>
                <div className="faq-item">
                    <h3>How to use SkillSpark?</h3>
                    <p>
                      You have to sign up and create a profile. You can then browse through the available projects or post your own project on your profile.
                      Or you search for sparkies on the bookings page and book them for your project. You can see the Sparkies profile through their github account!
                    </p>
                </div>
            </section>

            <section className="contact">
                <h2>Get in Touch</h2>
                <p>
                    If you have more questions or need further assistance, feel
                    free to reach out to us at{" "}
                    <a href="mailto:skillspark.contact@gmail.com">
                        skillspark.contact@gmail.com
                    </a>
                    .
                </p>
            </section>

            {/* <footer>
        <p>&copy; 2025 SkillSpark | All rights reserved</p>
      </footer> */}
        </div>
    );
};

export default FAQ;
