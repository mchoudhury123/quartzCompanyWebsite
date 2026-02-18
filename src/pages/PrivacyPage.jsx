import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPage.css';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-hero-overlay" />
        <div className="privacy-hero-content">
          <h1>Privacy Policy</h1>
          <p className="privacy-updated">Last updated: March 2025</p>
        </div>
      </section>

      <div className="legal-content">
        <nav className="table-of-contents">
          <h2>Contents</h2>
          <ol>
            <li>
              <a href="#introduction" onClick={(e) => handleAnchorClick(e, 'introduction')}>
                Introduction
              </a>
            </li>
            <li>
              <a href="#information-we-collect" onClick={(e) => handleAnchorClick(e, 'information-we-collect')}>
                Information We Collect
              </a>
            </li>
            <li>
              <a href="#how-we-use" onClick={(e) => handleAnchorClick(e, 'how-we-use')}>
                How We Use Your Information
              </a>
            </li>
            <li>
              <a href="#legal-basis" onClick={(e) => handleAnchorClick(e, 'legal-basis')}>
                Legal Basis for Processing
              </a>
            </li>
            <li>
              <a href="#data-sharing" onClick={(e) => handleAnchorClick(e, 'data-sharing')}>
                Data Sharing
              </a>
            </li>
            <li>
              <a href="#data-retention" onClick={(e) => handleAnchorClick(e, 'data-retention')}>
                Data Retention
              </a>
            </li>
            <li>
              <a href="#your-rights" onClick={(e) => handleAnchorClick(e, 'your-rights')}>
                Your Rights
              </a>
            </li>
            <li>
              <a href="#cookies" onClick={(e) => handleAnchorClick(e, 'cookies')}>
                Cookies
              </a>
            </li>
            <li>
              <a href="#contact-us" onClick={(e) => handleAnchorClick(e, 'contact-us')}>
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        <section id="introduction" className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to the privacy policy of The Quartz Company Ltd ("we", "us", "our"), a company
            registered in England and Wales with its registered office
            in Northampton, Northamptonshire.
          </p>
          <p>
            We are committed to protecting and respecting your privacy. This policy sets out the
            basis on which any personal data we collect from you, or that you provide to us, will
            be processed by us. Please read the following carefully to understand our views and
            practices regarding your personal data and how we will treat it.
          </p>
          <p>
            For the purposes of UK data protection legislation (including the UK General Data
            Protection Regulation and the Data Protection Act 2018), the data controller is
            The Quartz Company Ltd.
          </p>
        </section>

        <section id="information-we-collect" className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>We may collect and process the following categories of personal data:</p>

          <h3>2.1 Information You Provide to Us</h3>
          <ul>
            <li>
              <strong>Identity Data:</strong> Your full name, title, and any identification
              documents required for credit checks.
            </li>
            <li>
              <strong>Contact Data:</strong> Your postal address, email address, telephone
              number(s), and any preferred method of communication.
            </li>
            <li>
              <strong>Property Data:</strong> Details about your property relevant to our survey,
              templating, and installation services, including kitchen measurements and layout
              information.
            </li>
            <li>
              <strong>Financial Data:</strong> Bank account details, payment card information, and
              credit history where applicable for finance applications.
            </li>
            <li>
              <strong>Transaction Data:</strong> Details of products and services you have
              purchased from us, including quotes, orders, and payment history.
            </li>
          </ul>

          <h3>2.2 Information We Collect Automatically</h3>
          <ul>
            <li>
              <strong>Technical Data:</strong> Your internet protocol (IP) address, browser type
              and version, time zone setting, browser plug-in types and versions, operating system
              and platform, and other technology on the devices you use to access our website.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our website, including
              pages visited, time spent on pages, navigation paths, and search queries.
            </li>
            <li>
              <strong>Cookie Data:</strong> Data collected through cookies, pixel tags, and
              similar technologies. Please see our{' '}
              <Link to="/cookies">Cookie Policy</Link> for further details.
            </li>
          </ul>

          <h3>2.3 Information from Third Parties</h3>
          <ul>
            <li>
              Credit reference agencies when you apply for finance options.
            </li>
            <li>
              Analytics providers such as Google Analytics.
            </li>
            <li>
              Advertising networks and social media platforms.
            </li>
          </ul>
        </section>

        <section id="how-we-use" className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the personal data we collect for the following purposes:</p>

          <h3>3.1 Fulfilling Orders and Services</h3>
          <ul>
            <li>Processing and managing your orders for kitchen worktops and related products.</li>
            <li>Arranging surveys, templating appointments, and installation visits.</li>
            <li>Communicating with you about the progress of your order.</li>
            <li>Processing payments and issuing invoices or receipts.</li>
          </ul>

          <h3>3.2 Providing Quotes and Consultations</h3>
          <ul>
            <li>Responding to your enquiries and providing tailored quotations.</li>
            <li>Arranging consultations and site visits.</li>
            <li>Following up on quotes to assist your decision-making process.</li>
          </ul>

          <h3>3.3 Marketing and Communications</h3>
          <ul>
            <li>
              Sending you promotional materials about our products, services, and special offers
              where you have opted in to receive these.
            </li>
            <li>Displaying relevant advertisements on social media platforms and other websites.</li>
            <li>Inviting you to participate in customer satisfaction surveys or product reviews.</li>
          </ul>

          <h3>3.4 Business Operations</h3>
          <ul>
            <li>Improving our website, products, and services.</li>
            <li>Analysing usage patterns to enhance user experience.</li>
            <li>Preventing fraud and ensuring the security of our systems.</li>
            <li>Meeting our legal and regulatory obligations.</li>
          </ul>
        </section>

        <section id="legal-basis" className="legal-section">
          <h2>4. Legal Basis for Processing</h2>
          <p>
            We will only process your personal data where we have a lawful basis to do so. The
            legal bases we rely on include:
          </p>

          <h3>4.1 Consent</h3>
          <p>
            Where you have given us clear consent to process your personal data for a specific
            purpose, such as receiving marketing communications. You may withdraw your consent at
            any time by contacting us or using the unsubscribe link in our emails.
          </p>

          <h3>4.2 Performance of a Contract</h3>
          <p>
            Where processing your data is necessary for the performance of a contract we have
            with you, or to take steps at your request before entering into a contract. This
            includes processing your order, arranging installation, and handling payments.
          </p>

          <h3>4.3 Legitimate Interests</h3>
          <p>
            Where processing is necessary for our legitimate interests (or those of a third
            party) and your interests and fundamental rights do not override those interests.
            This includes improving our services, understanding our customer base, and preventing
            fraud.
          </p>

          <h3>4.4 Legal Obligation</h3>
          <p>
            Where processing is necessary for us to comply with a legal obligation, such as
            maintaining financial records or responding to lawful requests from authorities.
          </p>
        </section>

        <section id="data-sharing" className="legal-section">
          <h2>5. Data Sharing</h2>
          <p>
            We may share your personal data with the following categories of third parties for the
            purposes outlined in this policy:
          </p>

          <h3>5.1 Service Providers</h3>
          <ul>
            <li>
              <strong>Installation Partners:</strong> Approved fitters and installers who carry
              out templating and installation work on our behalf.
            </li>
            <li>
              <strong>Delivery Companies:</strong> Courier and logistics providers who deliver
              our products to your property.
            </li>
            <li>
              <strong>IT Service Providers:</strong> Companies that provide website hosting, email
              services, and CRM systems.
            </li>
            <li>
              <strong>Payment Processors:</strong> Secure payment gateway providers who process
              your card payments.
            </li>
          </ul>

          <h3>5.2 Finance Partners</h3>
          <p>
            If you apply for finance to fund your purchase, we will share relevant personal and
            financial data with our finance partners to process your application. This may include
            sharing data with credit reference agencies.
          </p>

          <h3>5.3 Our Commitment</h3>
          <p className="legal-highlight">
            We will never sell, rent, or trade your personal data to third parties for their
            marketing purposes. We require all third parties to respect the security of your
            personal data and to treat it in accordance with the law.
          </p>
        </section>

        <section id="data-retention" className="legal-section">
          <h2>6. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as reasonably necessary to fulfil
            the purposes we collected it for. The retention periods we apply are as follows:
          </p>
          <ul>
            <li>
              <strong>Customer Records:</strong> We retain order and transaction data for 7 years
              from the date of your last purchase to comply with our legal and tax obligations.
            </li>
            <li>
              <strong>Warranty Records:</strong> Data relating to warranties is retained for the
              duration of the warranty period plus 1 year.
            </li>
            <li>
              <strong>Marketing Data:</strong> If you have opted in to marketing, we will retain
              your contact details until you unsubscribe or request deletion. We review inactive
              marketing contacts every 24 months.
            </li>
            <li>
              <strong>Quote Enquiries:</strong> If you request a quote but do not proceed with an
              order, we will retain your data for 12 months before securely deleting it.
            </li>
            <li>
              <strong>Website Analytics:</strong> Anonymised analytics data may be retained
              indefinitely for trend analysis and business planning.
            </li>
          </ul>
        </section>

        <section id="your-rights" className="legal-section">
          <h2>7. Your Rights</h2>
          <p>
            Under UK data protection law, you have a number of rights in relation to your
            personal data. You may exercise any of these rights by contacting us using the
            details provided in Section 9 below.
          </p>

          <div className="rights-grid">
            <div className="right-item">
              <h3>Right of Access</h3>
              <p>
                You have the right to request a copy of the personal data we hold about you. This
                is commonly known as a "Subject Access Request". We will respond within one month
                of receiving your request.
              </p>
            </div>
            <div className="right-item">
              <h3>Right to Rectification</h3>
              <p>
                You have the right to request that we correct any personal data that is inaccurate
                or incomplete. We will make the necessary corrections promptly.
              </p>
            </div>
            <div className="right-item">
              <h3>Right to Erasure</h3>
              <p>
                You have the right to request the deletion of your personal data in certain
                circumstances, for example where it is no longer necessary for the purposes for
                which it was collected.
              </p>
            </div>
            <div className="right-item">
              <h3>Right to Data Portability</h3>
              <p>
                You have the right to request that we transfer your personal data to another
                organisation, or directly to you, in a structured, commonly used, and
                machine-readable format.
              </p>
            </div>
            <div className="right-item">
              <h3>Right to Restrict Processing</h3>
              <p>
                You have the right to request that we restrict the processing of your personal
                data in certain circumstances, such as where you contest the accuracy of the data.
              </p>
            </div>
            <div className="right-item">
              <h3>Right to Object</h3>
              <p>
                You have the right to object to the processing of your personal data where we are
                relying on a legitimate interest, or where we are processing your data for direct
                marketing purposes.
              </p>
            </div>
          </div>

          <p>
            If you are not satisfied with how we handle your request, you have the right to lodge
            a complaint with the Information Commissioner's Office (ICO). You can contact the ICO
            at{' '}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>{' '}
            or by calling 0303 123 1113.
          </p>
        </section>

        <section id="cookies" className="legal-section">
          <h2>8. Cookies</h2>
          <p>
            Our website uses cookies and similar tracking technologies to distinguish you from
            other users. This helps us provide you with a good experience when you browse our
            website and allows us to improve our site.
          </p>
          <p>
            For detailed information about the cookies we use, the purposes for which we use
            them, and how you can manage your cookie preferences, please see our{' '}
            <Link to="/cookies" className="legal-link">
              Cookie Policy
            </Link>.
          </p>
        </section>

        <section id="contact-us" className="legal-section">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, wish to exercise your data
            protection rights, or have a complaint about how we have handled your personal data,
            please contact our Data Protection Officer:
          </p>
          <div className="contact-details">
            <p><strong>Data Protection Officer</strong></p>
            <p>The Quartz Company Ltd</p>
            <p>Northampton, Northamptonshire</p>
            <p>
              Email:{' '}
              <a href="mailto:privacy@thequartzcompany.co.uk">privacy@thequartzcompany.co.uk</a>
            </p>
            <p>
              Telephone:{' '}
              <a href="tel:+441234567890">01234 567 890</a>
            </p>
          </div>
          <p>
            We aim to respond to all legitimate requests within one month. Occasionally it may
            take us longer if your request is particularly complex or you have made a number of
            requests, in which case we will notify you and keep you updated.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
