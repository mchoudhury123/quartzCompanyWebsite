import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const values = [
  {
    icon: '\u2726',
    title: 'Craftsmanship',
    description:
      'We believe in doing things properly, never cutting corners. Every surface is templated, cut and polished by skilled hands using state-of-the-art machinery.',
  },
  {
    icon: '\u2618',
    title: 'Sustainability',
    description:
      'Responsibly sourced materials, minimal waste and carbon-offset delivery. We recycle 95% of our offcuts and use water-recirculation systems in our workshop.',
  },
  {
    icon: '\u2691',
    title: 'Transparency',
    description:
      'Honest pricing, clear timelines and no hidden costs. Your quote is your quote \u2014 we never add surprise extras after the fact.',
  },
  {
    icon: '\u2764',
    title: 'Community',
    description:
      'Supporting local apprenticeships and British manufacturing. We partner with colleges across the Midlands to train the next generation of stone craftspeople.',
  },
];

const stats = [
  { figure: '20', label: 'Years Experience' },
  { figure: '50,000+', label: 'Kitchens Completed' },
  { figure: '200+', label: 'Colours Available' },
  { figure: '98%', label: 'Customer Satisfaction' },
];

function AboutPage() {
  return (
    <div className="about-page">
      {/* ── Hero with Stats Overlay ── */}
      <section className="about-hero">
        <div className="about-hero__body">
          <div className="container">
            <h1 className="about-hero__title">Our Story</h1>
            <p className="about-hero__subtitle">
              Crafting exceptional surfaces since 2005
            </p>
          </div>
        </div>
        <div className="about-hero__stats">
          <div className="container">
            <div className="about-hero__stats-row">
              {stats.map((stat) => (
                <div key={stat.label} className="about-hero__stat">
                  <span className="about-hero__stat-figure">{stat.figure}</span>
                  <span className="about-hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="about-story section">
        <div className="container">
          <div className="about-story__body">
            <h2 className="about-story__heading">
              From a Small Workshop to Britain's Trusted Surface Specialists
            </h2>
            <p>
              The Quartz Company was born from a simple belief: that every home
              deserves surfaces crafted with passion, precision and purpose.
              Founded in 2005 in the heart of the British Midlands, we began
              as a small workshop with three artisans and a single CNC
              machine. What we lacked in scale, we made up for in
              determination and an unwavering commitment to quality.
            </p>
            <p>
              In those early years, we earned our reputation one kitchen at a
              time. Word spread quickly among local homeowners and designers
              who noticed the difference that true craftsmanship makes: joints
              so precise they almost disappear, edges polished to a mirror
              finish and installations completed on time, every time. By 2010,
              demand had outgrown our original unit and we moved to a
              purpose-built fabrication facility in Northampton, investing in
              five-axis CNC technology that allowed us to combine traditional
              skill with modern precision.
            </p>

            <blockquote className="about-story__pullquote">
              Quality is not just a department; it is the entire company.
            </blockquote>

            <p>
              Today, The Quartz Company is one of the UK's most trusted names in
              premium worktops. Our team has grown to over 80 specialists
              &mdash; from designers and templaters to CNC operators and
              installation technicians &mdash; yet we have never lost the
              hands-on ethos that defined our earliest days. Every surface
              that leaves our workshop is personally inspected by a senior
              craftsperson, because we believe that quality is not just a
              department; it is the entire company.
            </p>
            <p>
              Looking ahead, we remain committed to the values that got us
              here: meticulous craftsmanship, honest service and a genuine
              passion for helping homeowners create kitchens they love. Whether
              you choose the engineered resilience of quartz, you can trust that a The Quartz Company
              surface is made to last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="about-values section section--cream">
        <div className="container">
          <h2 className="about-values__title">Our Values</h2>
          <p className="about-values__subtitle">
            The principles that guide everything we do, from the quarry to your
            kitchen.
          </p>
          <div className="about-values__list">
            {values.map((value, index) => (
              <div key={value.title} className="about-values__item">
                <div className="about-values__item-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="about-values__item-content">
                  <h3 className="about-values__item-title">
                    <span className="about-values__item-icon" aria-hidden="true">
                      {value.icon}
                    </span>
                    {value.title}
                  </h3>
                  <p className="about-values__item-text">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Workshop ── */}
      <section className="about-workshop">
        <div className="about-workshop__image">
          <div className="about-workshop__image-placeholder">
            <span>CNC Fabrication Process</span>
          </div>
        </div>
        <div className="about-workshop__card">
          <h2 className="about-workshop__heading">Our Workshop</h2>
          <p>
            Our fabrication facility in Northampton houses some
            of the most advanced stone-working equipment in the UK. From
            five-axis CNC saws to automated edge-polishing lines, we combine
            cutting-edge technology with traditional hand-finishing
            techniques to produce surfaces of unrivalled quality.
          </p>
          <p>
            Every worktop begins with a precision laser-template of your
            kitchen, accurate to within 1mm. This digital template is fed
            directly into our CNC machines, ensuring a perfect fit every
            time. Once cut, each surface is hand-inspected, polished and
            quality-checked before it leaves our workshop.
          </p>
          <p>
            We are proud to hold ISO 9001 quality certification and operate
            a zero-to-landfill policy, recycling or repurposing 95% of our
            stone offcuts into sample pieces, chopping boards and community
            art projects.
          </p>
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section className="about-team section">
        <div className="container">
          <h2 className="about-team__title">Our People</h2>
          <p className="about-team__subtitle">
            Meet our team of artisans, designers and installation experts who
            bring your vision to life.
          </p>
          <div className="about-team__placeholder">
            <div className="about-team__placeholder-inner">
              <span className="about-team__placeholder-icon" aria-hidden="true">
                &#128101;
              </span>
              <p className="about-team__placeholder-text">
                Team member profiles coming soon. In the meantime, you can meet
                our friendly team in person at our{' '}
                <Link to="/showrooms">Northampton showroom</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta section">
        <div className="container">
          <div className="about-cta__card">
            <h2 className="about-cta__heading">
              Want to Visit Our Workshop?
            </h2>
            <p className="about-cta__text">
              See our craftspeople at work, explore over 200 surface options and
              discuss your project face to face with one of our designers.
            </p>
            <Link to="/showrooms" className="btn btn--gold btn--lg">
              Book a Showroom Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
