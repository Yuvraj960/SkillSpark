import "../styles/About.css";

const About = () => {
  return (
    <div>

      <section className="intro">
        <h2>Welcome to SkillSpark</h2>
        <p>Your one-stop platform for micro-collaboration with skilled professionals around the world.</p>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>We aim to foster seamless collaboration among skilled individuals by providing an efficient platform for micro-projects. SkillSpark connects professionals to work together on diverse tasks and projects in a flexible, dynamic environment.</p>
      </section>

      <section className="team">
  <h2>Meet Our Team</h2>
  <div className="team-member">
    <h3>Yuvraj</h3>
    <p>Co-founder & CEO</p>
    <p>Yuvraj brings years of experience in entrepreneurship and leadership. He is passionate about empowering individuals to collaborate on impactful projects.</p>
  </div>

  <div className="team-member">
    <h3>Ridhi</h3>
    <p>Co-founder & Operations</p>
    <p>Ridhi has a background in operations management, ensuring that all processes run smoothly. She is dedicated to making SkillSpark's platform seamless and user-friendly.</p>
  </div>

  <div className="team-member">
    <h3>Yashswi</h3>
    <p>Head of Development</p>
    <p>Yashasvi is a software development expert with a keen eye for cutting-edge technology. She oversees all technical aspects of SkillSpark’s platform. Lorem ipsum dolor sit amet.</p>
   
  </div>

  <div className="team-member">
    <h3>Samridhi</h3>
    <p>Lead Designer</p>
    <p>Samridhi is a creative genius who specializes in UI/UX design. She ensures SkillSpark provides a visually stunning and intuitive experience for all users. Lorem ipsum dolor sit amet.</p>
    
  </div>
</section>


      <section className="contact">
        <h2>Get in Touch</h2>
        <p>If you have any questions or want to collaborate, feel free to reach out to us at <a href="mailto:skillspark.contact@gmail.com">skillspark.contact@gmail.com</a>.</p>
      </section>
    </div>
  );
};

export default About;