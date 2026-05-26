import React from 'react';

export function IconButton({ label, onClick, children, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className="docente-header-button" aria-label={label}>
      {children}
    </button>
  );
}

export function ArrowLeftIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserCogIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 22c0-4.1421 3.3579-7.5 7.5-7.5s7.5 3.3579 7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20.5 11.6l.8.2c.4.1.7.5.7.9v1c0 .4-.3.8-.7.9l-.8.2a3.7 3.7 0 0 1-.4 1l.5.7c.3.3.2.8-.1 1.1l-.7.7c-.3.3-.8.4-1.1.1l-.7-.5c-.3.2-.6.3-1 .4l-.2.8c-.1.4-.5.7-.9.7h-1c-.4 0-.8-.3-.9-.7l-.2-.8c-.3-.1-.7-.2-1-.4l-.7.5c-.3.3-.8.2-1.1-.1l-.7-.7c-.3-.3-.4-.8-.1-1.1l.5-.7c-.2-.3-.3-.6-.4-1l-.8-.2c-.4-.1-.7-.5-.7-.9v-1c0-.4.3-.8.7-.9l.8-.2c.1-.3.2-.7.4-1l-.5-.7c-.3-.3-.2-.8.1-1.1l.7-.7c.3-.3.8-.4 1.1-.1l.7.5c.3-.2.6-.3 1-.4l.2-.8c.1-.4.5-.7.9-.7h1c.4 0 .8.3.9.7l.2.8c.3.1.7.2 1 .4l.7-.5c.3-.3.8-.2 1.1.1l.7.7c.3.3.4.8.1 1.1l-.5.7c.2.3.3.6.4 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M16.5 14.1a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
    </svg>
  );
}

export function PencilIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function FolderIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function MessageSquareIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
