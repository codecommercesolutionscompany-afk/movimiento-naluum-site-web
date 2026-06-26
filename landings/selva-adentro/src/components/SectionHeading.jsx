const SectionHeading = ({ eyebrow, title, intro, align = 'left' }) => (
  <div className={`sa-section-heading sa-section-heading--${align}`}>
    {eyebrow ? <span className="sa-eyebrow">{eyebrow}</span> : null}
    <h2>{title}</h2>
    {intro ? <p>{intro}</p> : null}
  </div>
);

export default SectionHeading;
