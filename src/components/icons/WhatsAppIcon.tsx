import React from 'react';

interface WhatsAppIconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Official WhatsApp vector brand icon
 */
export function WhatsAppIcon({ className = 'w-5 h-5', size, color = 'currentColor' }: WhatsAppIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>WhatsApp</title>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.16C10.56 20.16 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.6L5.06 16.28C4.24 14.98 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.43 7.65 20.29 9.71 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16ZM16.6 14.49C16.35 14.36 15.12 13.76 14.89 13.67C14.66 13.59 14.5 13.55 14.33 13.8C14.16 14.05 13.69 14.62 13.54 14.78C13.4 14.95 13.25 14.97 13 14.84C12.75 14.72 11.95 14.45 11 13.61C10.26 12.95 9.76 12.14 9.62 11.89C9.47 11.64 9.6 11.51 9.73 11.38C9.84 11.27 9.99 11.08 10.11 10.93C10.24 10.78 10.28 10.68 10.36 10.51C10.45 10.34 10.4 10.2 10.34 10.07C10.28 9.94 9.8 8.77 9.6 8.29C9.4 7.82 9.21 7.89 9.07 7.88C8.93 7.87 8.77 7.87 8.61 7.87C8.44 7.87 8.17 7.93 7.95 8.18C7.72 8.43 7.08 9.03 7.08 10.25C7.08 11.47 7.98 12.65 8.1 12.81C8.23 12.98 9.85 15.48 12.33 16.55C12.92 16.81 13.38 16.96 13.74 17.08C14.34 17.27 14.88 17.24 15.32 17.18C15.8 17.11 16.8 16.58 17.01 15.98C17.22 15.39 17.22 14.88 17.16 14.78C17.09 14.67 16.93 14.61 16.68 14.49H16.6Z" />
    </svg>
  );
}

/**
 * Official WhatsApp Badge featuring the signature circular green background and white handset glyph
 */
export function OfficialWhatsAppBadge({
  className = 'w-6 h-6',
  iconClassName = 'w-4 h-4'
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-xs ${className}`}>
      <WhatsAppIcon className={iconClassName} color="#ffffff" />
    </div>
  );
}
