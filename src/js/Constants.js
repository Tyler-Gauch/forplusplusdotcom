
export const BREAKPOINT_XS = "xs";
export const BREAKPOINT_SM = "sm";
export const BREAKPOINT_MD = "md";
export const BREAKPOINT_LG = "lg";
export const BREAKPOINT_XL = "xl";

export const BREAKPOINTS = [
    { [BREAKPOINT_XS]: 0 },
    { [BREAKPOINT_SM]: 576 },
    { [BREAKPOINT_MD]: 768 },
    { [BREAKPOINT_LG]: 992 },
    { [BREAKPOINT_XL]: 1200 }
];

export const BRAND_NAME = "ForPlusPlus";

// copied from serviceWorker.js to know if it is localhost or not
export const IS_LOCALHOST = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );