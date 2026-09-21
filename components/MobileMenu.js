'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';
import { useState, useSyncExternalStore } from 'react';
import ClientLink from './ClientLink';

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function MobileMenu({ links }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );

  return (
    <div className="mobile-navigation">
      <IconButton
        className="menu-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-menu"
        aria-label={`${isOpen ? 'Close' : 'Open'} navigation menu`}
        data-hydrated={isHydrated}
        disabled={!isHydrated}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Image src="/images/menu_icon.png" alt="" width={24} height={24} />
      </IconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 280 }
          }
        }}
      >
        <Box
          component="nav"
          id="mobile-navigation-menu"
          aria-label="Mobile navigation"
          sx={{ pt: 2 }}
        >
          <List>
            {links.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={ClientLink}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
