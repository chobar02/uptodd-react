
import aboutImage from './assets/images/1.webp';
const About = () => {
  return (
    <section>
      <h1>About Page</h1>
      <p className="Focus-section">We focus to personalise every child's journey< at our best. We are obsessed for success at every family which merges with UpTodd</p>
    <p>Our goal is to help every parent feel confident. Our play products are designed by child development experts and distilled to their simplest, purest purpose: to be exactly what children need at each stage.</p>
    <div>
    <img src={aboutImage} alt="About section" />
    </div>

    </section>
  );
};

export default About;
