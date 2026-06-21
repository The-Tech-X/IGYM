'use client';

import { createContext, useContext } from 'react';

type NavbarContextValue = {
  hideNavbar: boolean;
  setHideNavbar: (v: boolean) => void;
};

export const NavbarContext = createContext<NavbarContextValue>({
  hideNavbar: false,
  setHideNavbar: () => {},
});

export const useNavbarVisibility = () => useContext(NavbarContext);
