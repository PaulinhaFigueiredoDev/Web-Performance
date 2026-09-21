const footerGroups = [
  { title: 'Categories', links: ['Watches', 'Cameras', 'Phones', 'Tablets', 'Computers'] },
  { title: 'About Us', links: ['Our Story', 'Press', 'Blog', 'Awards', 'Stores'] },
  { title: 'Social Media', links: ['Facebook', 'Linkedin', 'Instagram', 'Twitter', 'Youtube'] },
  { title: 'Customer Service', links: ['Live Chat', 'Contact Us', 'Terms & Conditions', 'Delivery & Returns', 'Finance'] }
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function Footer() {
  return (
    <footer>
      <nav className="bottom-nav" aria-label="Footer navigation">
        <div className="container">
          {footerGroups.map((group) => {
            const titleId = `footer-${slugify(group.title)}`;
            return (
              <section
                key={group.title}
                id={group.title === 'About Us' ? 'about-us' : undefined}
                aria-labelledby={titleId}
              >
                <h2 className="list-title" id={titleId}>
                  {group.title}
                </h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link}><a href="#main-content">{link}</a></li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </nav>
      <div className="copyright-text">2020 © All Rights Reserved</div>
    </footer>
  );
}
