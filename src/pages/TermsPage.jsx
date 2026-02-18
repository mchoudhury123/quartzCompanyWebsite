import React, { useEffect } from 'react';
import './TermsPage.css';

const TermsPage = () => {
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
    <div className="terms-page">
      <section className="terms-hero">
        <div className="terms-hero-overlay" />
        <div className="terms-hero-content">
          <h1>Terms &amp; Conditions</h1>
          <p className="terms-updated">Last updated: March 2025</p>
        </div>
      </section>

      <div className="legal-content">
        <nav className="table-of-contents">
          <h2>Contents</h2>
          <ol>
            <li>
              <a href="#definitions" onClick={(e) => handleAnchorClick(e, 'definitions')}>
                Definitions
              </a>
            </li>
            <li>
              <a href="#our-products" onClick={(e) => handleAnchorClick(e, 'our-products')}>
                Our Products
              </a>
            </li>
            <li>
              <a href="#ordering-process" onClick={(e) => handleAnchorClick(e, 'ordering-process')}>
                Ordering Process
              </a>
            </li>
            <li>
              <a href="#pricing-payment" onClick={(e) => handleAnchorClick(e, 'pricing-payment')}>
                Pricing &amp; Payment
              </a>
            </li>
            <li>
              <a href="#delivery-installation" onClick={(e) => handleAnchorClick(e, 'delivery-installation')}>
                Delivery &amp; Installation
              </a>
            </li>
            <li>
              <a href="#cancellation-returns" onClick={(e) => handleAnchorClick(e, 'cancellation-returns')}>
                Cancellation &amp; Returns
              </a>
            </li>
            <li>
              <a href="#warranties" onClick={(e) => handleAnchorClick(e, 'warranties')}>
                Warranties
              </a>
            </li>
            <li>
              <a href="#limitation-liability" onClick={(e) => handleAnchorClick(e, 'limitation-liability')}>
                Limitation of Liability
              </a>
            </li>
            <li>
              <a href="#force-majeure" onClick={(e) => handleAnchorClick(e, 'force-majeure')}>
                Force Majeure
              </a>
            </li>
            <li>
              <a href="#governing-law" onClick={(e) => handleAnchorClick(e, 'governing-law')}>
                Governing Law
              </a>
            </li>
          </ol>
        </nav>

        <section id="definitions" className="legal-section">
          <h2>1. Definitions</h2>
          <p>In these Terms and Conditions, the following definitions apply:</p>
          <div className="definitions-list">
            <div className="definition-item">
              <strong>"Company", "we", "us", "our"</strong>
              <span>
                means The Quartz Company Ltd, a company registered in England and Wales, with its
                registered office in Northampton, Northamptonshire.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Customer", "you", "your"</strong>
              <span>
                means the person, firm, or company who purchases or agrees to purchase Products
                and/or Services from us.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Products"</strong>
              <span>
                means the kitchen worktops, surfaces, splashbacks, upstands, and any other engineered
                quartz products supplied by us.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Services"</strong>
              <span>
                means any services provided by us, including surveying, templating, fabrication,
                delivery, and installation.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Order"</strong>
              <span>
                means any accepted order for Products and/or Services placed by you with us.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Quote"</strong>
              <span>
                means an estimate of costs provided by us for the supply of Products and/or
                Services, which shall remain valid for 30 days unless otherwise stated.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Template"</strong>
              <span>
                means the precise measurement and templating of your kitchen or installation area,
                undertaken by our approved templaters prior to fabrication.
              </span>
            </div>
            <div className="definition-item">
              <strong>"Working Day"</strong>
              <span>
                means any day other than a Saturday, Sunday, or public holiday in England and
                Wales.
              </span>
            </div>
          </div>
        </section>

        <section id="our-products" className="legal-section">
          <h2>2. Our Products</h2>

          <h3>2.1 Product Descriptions</h3>
          <p>
            All product descriptions, images, and samples provided on our website, in our
            showroom, or through other marketing materials are intended as a guide only. We make
            every effort to display colours and textures as accurately as possible; however,
            actual products may vary slightly from images and samples due to the following
            factors:
          </p>
          <ul>
            <li>
              <strong>Natural Variation:</strong> Engineered quartz surfaces are highly consistent,
              but minor variations in colour, pattern, and particle distribution may occur
              between production batches. These characteristics are a feature of the
              material, not a defect.
            </li>
            <li>
              <strong>Engineered Quartz:</strong> While engineered quartz surfaces are
              highly consistent, minor variations in colour, pattern, and particle distribution may
              occur between production batches.
            </li>
            <li>
              <strong>Display Differences:</strong> Colours and textures may appear differently on
              screen due to monitor settings, lighting conditions, and other display variables.
            </li>
          </ul>

          <h3>2.2 Sample Policy</h3>
          <p>
            We strongly recommend that customers view and approve physical samples of their
            chosen material before placing an order. Sample pieces are available on request and
            may be viewed at our showroom or sent by post. Samples are provided free of charge
            but remain indicative of the material rather than an exact representation of the
            finished product.
          </p>

          <h3>2.3 Material Suitability</h3>
          <p>
            Different quartz materials have different properties and care requirements.
            It is your responsibility to ensure that your chosen material is suitable for its
            intended use. Our team will be happy to advise on material suitability during the
            consultation process.
          </p>
        </section>

        <section id="ordering-process" className="legal-section">
          <h2>3. Ordering Process</h2>
          <p>The process for ordering Products and Services from us is as follows:</p>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Quote</h3>
                <p>
                  You submit an enquiry via our website, telephone, or showroom visit. We will
                  provide you with a detailed written quotation based on the information you
                  provide, including your chosen material, approximate dimensions, and any
                  additional requirements. Quotes are valid for 30 days unless otherwise stated.
                </p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Deposit &amp; Order Confirmation</h3>
                <p>
                  To proceed with your order, a deposit of 50% of the quoted price is required.
                  Upon receipt of your deposit, we will issue an Order Confirmation. This
                  constitutes a binding contract between you and us, subject to these Terms and
                  Conditions.
                </p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Template</h3>
                <p>
                  Our approved templater will visit your property to take precise laser
                  measurements of your kitchen or installation area. Templating is typically
                  scheduled within 5-10 Working Days of your deposit being received. Your kitchen
                  units and appliances must be fully fitted and in their final position before
                  templating can take place.
                </p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Fabrication</h3>
                <p>
                  Following the template, your worktops will be precision-cut and fabricated in
                  our workshop. The fabrication process typically takes 5-10 Working Days
                  depending on complexity and material availability.
                </p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Installation</h3>
                <p>
                  Our experienced installation team will deliver and install your worktops at your
                  property. The remaining balance must be paid before the installation date.
                  Installation is typically completed within one day, though larger or more
                  complex projects may require additional time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing-payment" className="legal-section">
          <h2>4. Pricing &amp; Payment</h2>

          <h3>4.1 Pricing</h3>
          <ul>
            <li>
              All prices quoted include VAT at the prevailing rate (currently 20%) unless
              otherwise stated.
            </li>
            <li>
              Prices are based on the information provided at the time of quotation. The final
              price may be adjusted following the template if the actual measurements or
              requirements differ significantly from the initial estimate.
            </li>
            <li>
              We reserve the right to adjust pricing in the event of significant changes in
              material costs or currency fluctuations, provided that we notify you before any
              such adjustment and you have the right to cancel your order without penalty.
            </li>
          </ul>

          <h3>4.2 Deposit</h3>
          <p>
            A non-refundable deposit of 50% of the total order value is required to confirm your
            order. The deposit secures your chosen material and reserves your place in our
            production schedule. The deposit may be paid by bank transfer, debit card, or credit
            card.
          </p>

          <h3>4.3 Balance Payment</h3>
          <p>
            The remaining 50% balance is due no later than 3 Working Days before the scheduled
            installation date. Installation will not proceed until full payment has been received.
            Failure to pay the balance by the due date may result in your installation being
            rescheduled, subject to availability.
          </p>

          <h3>4.4 Finance Options</h3>
          <p>
            We may offer finance options through our approved finance partners. Finance is subject
            to status, terms, and conditions. Full details of available finance options will be
            provided upon request. The Quartz Company Ltd acts as a credit broker and not a lender.
          </p>
        </section>

        <section id="delivery-installation" className="legal-section">
          <h2>5. Delivery &amp; Installation</h2>

          <h3>5.1 Lead Times</h3>
          <p>
            Typical lead times from deposit to installation are 2-4 weeks, depending on material
            availability and production schedule. We will provide you with an estimated
            installation date at the time of order confirmation. While we make every effort to
            meet estimated dates, these are not guaranteed and do not constitute a term of the
            contract.
          </p>

          <h3>5.2 Access Requirements</h3>
          <p>
            You must ensure that our installation team has adequate access to your property and
            the installation area. This includes:
          </p>
          <ul>
            <li>
              Clear and unobstructed pathways from the point of entry to the kitchen or
              installation area.
            </li>
            <li>
              Removal of any existing worktops, splashbacks, or obstacles prior to our arrival
              (unless removal has been included in your order).
            </li>
            <li>
              Adequate parking for our installation vehicle within reasonable proximity of your
              property.
            </li>
            <li>
              An adult (18 years or over) must be present at the property throughout the
              installation.
            </li>
          </ul>

          <h3>5.3 Property Preparation</h3>
          <p>
            Before installation, the following must be in place:
          </p>
          <ul>
            <li>All kitchen base units must be fully fitted, level, and secured in their final position.</li>
            <li>Plumbing and electrical services must be completed and disconnected ready for worktop fitting.</li>
            <li>Sinks, taps, and appliances must be available on site for fitting during installation.</li>
            <li>The installation area should be clear of personal belongings, crockery, and food items.</li>
          </ul>

          <h3>5.4 Additional Charges</h3>
          <p>
            If our installation team arrives and is unable to proceed due to the property not
            being adequately prepared, we reserve the right to charge a recall fee to cover
            the cost of rescheduling. This fee will be communicated to you before being applied.
          </p>
        </section>

        <section id="cancellation-returns" className="legal-section">
          <h2>6. Cancellation &amp; Returns</h2>

          <h3>6.1 Cooling-Off Period</h3>
          <p>
            If you placed your order at a distance (online or by telephone) rather than in our
            showroom, you have a statutory right to cancel your order within 14 days of the date
            of Order Confirmation, in accordance with the Consumer Contracts (Information,
            Cancellation and Additional Charges) Regulations 2013.
          </p>

          <h3>6.2 Bespoke Product Limitations</h3>
          <p className="legal-highlight">
            Please note that our Products are made to your specific measurements and
            specifications. Once fabrication has commenced (i.e., following the template), the
            Products are considered bespoke and the right to cancel under the cooling-off period
            no longer applies. By consenting to the template being carried out within the
            14-day cooling-off period, you acknowledge that you will lose your right to cancel
            once fabrication begins.
          </p>

          <h3>6.3 Cancellation Before Fabrication</h3>
          <p>
            If you cancel your order before fabrication has commenced but after the 14-day
            cooling-off period, we will refund your deposit less an administrative charge of 15%
            of the total order value to cover costs already incurred.
          </p>

          <h3>6.4 Cancellation After Fabrication</h3>
          <p>
            If you cancel your order after fabrication has commenced, no refund of the deposit
            will be given, as the Products will have been custom-made to your specifications and
            cannot be resold.
          </p>

          <h3>6.5 Defective Products</h3>
          <p>
            If you believe your Products are defective, please contact us within 48 hours of
            installation. We will inspect the Products and, where a genuine defect is confirmed,
            repair or replace the affected area at no additional cost.
          </p>
        </section>

        <section id="warranties" className="legal-section">
          <h2>7. Warranties</h2>

          <h3>7.1 Material Warranty</h3>
          <p>
            Many of the materials we supply come with a manufacturer's warranty covering defects
            in the material itself. The duration and terms of the manufacturer's warranty vary
            by material and brand. Details of the applicable warranty will be provided with your
            Order Confirmation and warranty documentation.
          </p>
          <ul>
            <li>
              <strong>Quartz Surfaces:</strong> Typically covered by a manufacturer's warranty of
              up to 15-25 years depending on the brand, covering manufacturing defects.
            </li>
            <li>
              <strong>Engineered Quartz:</strong> Typically covered by a manufacturer's warranty of
              up to 15-25 years depending on the brand, covering manufacturing defects.
            </li>
            <li>
              <strong>Full Body Printed Quartz:</strong> Typically covered by a manufacturer's warranty
              of up to 15-25 years depending on the specification, covering manufacturing defects.
            </li>
          </ul>

          <h3>7.2 Installation Warranty</h3>
          <p>
            We provide a 2-year warranty on our installation workmanship, commencing from the
            date of installation. This covers defects arising from faulty workmanship, including
            poor fitting, inadequate sealing, or structural failure caused by installation error.
          </p>

          <h3>7.3 Warranty Exclusions</h3>
          <p>Our warranties do not cover:</p>
          <ul>
            <li>Damage caused by misuse, neglect, or failure to follow care and maintenance guidelines.</li>
            <li>Staining, etching, or damage caused by chemicals, extreme heat, or abrasive cleaning products.</li>
            <li>Chips, cracks, or scratches caused by impact or excessive force.</li>
            <li>Normal wear and tear, including minor colour changes due to UV exposure.</li>
            <li>Movement, cracking, or damage caused by structural movement of the building or kitchen units.</li>
            <li>Work carried out by third parties on or around the Products after installation.</li>
          </ul>
        </section>

        <section id="limitation-liability" className="legal-section">
          <h2>8. Limitation of Liability</h2>

          <h3>8.1 Our Liability</h3>
          <p>
            Nothing in these Terms and Conditions shall exclude or limit our liability for:
          </p>
          <ul>
            <li>Death or personal injury caused by our negligence.</li>
            <li>Fraud or fraudulent misrepresentation.</li>
            <li>Any matter for which it would be illegal for us to exclude or limit our liability.</li>
          </ul>

          <h3>8.2 Limitation</h3>
          <p>
            Subject to Section 8.1, our total liability to you in respect of all losses arising
            under or in connection with the contract, whether in contract, tort (including
            negligence), breach of statutory duty, or otherwise, shall in no circumstances exceed
            the total price paid by you under the contract.
          </p>

          <h3>8.3 Indirect Losses</h3>
          <p>
            We shall not be liable for any indirect, consequential, or special losses, including
            but not limited to loss of profit, loss of business, loss of goodwill, or loss of
            anticipated savings.
          </p>
        </section>

        <section id="force-majeure" className="legal-section">
          <h2>9. Force Majeure</h2>
          <p>
            We shall not be liable for any delay or failure to perform our obligations under the
            contract if such delay or failure results from circumstances beyond our reasonable
            control, including but not limited to:
          </p>
          <ul>
            <li>Acts of God, natural disasters, adverse weather conditions.</li>
            <li>War, terrorism, civil unrest, or government sanctions.</li>
            <li>Epidemics, pandemics, or public health emergencies.</li>
            <li>Strikes, industrial action, or labour disputes.</li>
            <li>Supply chain disruptions, material shortages, or shipping delays.</li>
            <li>Power failures, IT system failures, or telecommunications failures.</li>
          </ul>
          <p>
            In the event of a Force Majeure event, we will notify you as soon as reasonably
            practicable and use our best endeavours to minimise the impact on your order. If a
            Force Majeure event continues for more than 60 days, either party may terminate the
            contract by giving written notice, and we will refund any payments made less the cost
            of any Products already fabricated.
          </p>
        </section>

        <section id="governing-law" className="legal-section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms and Conditions, and any dispute or claim arising out of or in connection
            with them or their subject matter or formation (including non-contractual disputes or
            claims), shall be governed by and construed in accordance with the laws of England
            and Wales.
          </p>
          <p>
            The courts of England and Wales shall have exclusive jurisdiction to settle any
            dispute or claim arising out of or in connection with these Terms and Conditions or
            their subject matter or formation.
          </p>
          <p>
            If any provision of these Terms and Conditions is found by any court or authority of
            competent jurisdiction to be invalid, unlawful, or unenforceable, that provision shall
            be deemed modified to the minimum extent necessary to make it valid, lawful, and
            enforceable. If such modification is not possible, the relevant provision shall be
            deemed deleted. Any modification to or deletion of a provision shall not affect the
            validity and enforceability of the remaining provisions.
          </p>

          <div className="terms-footer">
            <p>
              <strong>The Quartz Company Ltd</strong><br />
              Northampton, Northamptonshire<br />
              Email: <a href="mailto:info@thequartzcompany.co.uk">info@thequartzcompany.co.uk</a> |
              Tel: <a href="tel:+441234567890">01234 567 890</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
