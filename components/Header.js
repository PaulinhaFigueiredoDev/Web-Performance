import Link from 'next/link';
import MobileMenu from './MobileMenu';

const navigationLinks = [
  { href: '#about-us', label: 'About us' },
  { href: '#best-sellers-section', label: 'Best Sellers' },
  { href: '#newsletter-section', label: 'Newsletter' }
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          <Link href="/">
            <strong>VR</strong>
            <span className="blue-dot" aria-hidden="true" />
            <span className="blue-dot" aria-hidden="true" />
            <span>Headsets</span>
          </Link>
        </div>

        <nav className="desktop-navigation" aria-label="Main navigation">
          <ul>
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileMenu links={navigationLinks} />
      </div>
    </header>
  );
}
