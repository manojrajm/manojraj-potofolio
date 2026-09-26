import React from "react";

interface SkillIconProps {
  name: string;
  className?: string;
}

export function SkillIcon({ name, className = "w-4 h-4" }: SkillIconProps) {
  const norm = name.toLowerCase();

  if (norm.includes("react router")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#f44250" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  if (norm.includes("react")) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="#61dafb">
        <circle cx="0" cy="0" r="2.05" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (norm === "javascript") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#f7df1e">
        <rect width="24" height="24" rx="4" fill="#f7df1e" />
        <path d="M12 14.5c0 2.5-1.5 3.5-3.5 3.5-1.8 0-3-1-3.5-2.2l2-1.2c.3.7.8 1.2 1.5 1.2.7 0 1.2-.4 1.2-1.3V8h2.3v6.5zm5.5 0c0 2.2-1.4 3.5-3.6 3.5-2.1 0-3.3-1.2-3.8-2.3l2-1.2c.4.7.9 1.2 1.8 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-1-1.7-1.5l-.6-.2c-1.7-.7-2.8-1.5-2.8-3.2 0-1.8 1.4-3.1 3.3-3.1 1.6 0 2.7.7 3.3 1.9l-1.9 1.2c-.3-.6-.7-.9-1.4-.9-.7 0-1.1.4-1.1.9 0 .6.4.9 1.5 1.3l.6.3c2 .8 3.1 1.7 3.1 3.3z" fill="#000" />
      </svg>
    );
  }

  if (norm === "typescript") {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <path d="M6 9h6v2H9.5v7H7.5v-7H6V9zm7 6.5c.4.6 1 .9 1.8.9.8 0 1.3-.4 1.3-1 0-.6-.5-1-1.6-1.5l-.6-.2c-1.6-.7-2.6-1.5-2.6-3.1 0-1.8 1.4-3.1 3.3-3.1 1.5 0 2.6.7 3.1 1.8l-1.8 1.1c-.3-.5-.7-.8-1.3-.8-.6 0-1 .4-1 .9 0 .5.4.8 1.4 1.2l.6.3c1.9.8 2.9 1.7 2.9 3.2 0 1.9-1.4 3.2-3.5 3.2-1.9 0-3.2-1.1-3.7-2.2l2-1.2z" fill="#fff" />
      </svg>
    );
  }

  if (norm === "python") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2c-3.4 0-5.5 1.5-5.5 4.5v2.3h5.6v.8H4.2C2 9.6 2 12.3 2 14.6c0 2.7 1.8 4.4 4.5 4.4h1.7v-2.4c0-2.4 2-4.4 4.4-4.4h4.3v-.8c0-2.7-2.2-4.4-5.5-4.4zm-1.8 1.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#3776ab" />
        <path d="M12.1 22c3.4 0 5.5-1.5 5.5-4.5v-2.3H12v-.8h7.8c2.2 0 2.2-2.7 2.2-5 0-2.7-1.8-4.4-4.5-4.4h-1.7v2.4c0 2.4-2 4.4-4.4 4.4H7.1v.8c0 2.7 2.2 4.4 5.5 4.4zm1.8-1.6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="#ffd438" />
      </svg>
    );
  }

  if (norm === "java" || norm.includes("jdbc")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#ea2d2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    );
  }

  if (norm.includes("angular")) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <polygon points="12 2 2 6 3.5 17.5 12 22 20.5 17.5 22 6 12 2" fill="#dd0031" />
        <polygon points="12 4.4 12 19.4 18.2 16 19.5 6.4 12 4.4" fill="#c3002f" />
        <path d="M12 5.5l-4.5 10.5h1.8l.9-2.3h3.6l.9 2.3h1.8L12 5.5zm-1.1 6.7l1.1-2.8 1.1 2.8h-2.2z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes("bootstrap")) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#7952b3" />
        <path d="M7 6h5c2 0 3.2.9 3.2 2.3 0 1-.6 1.7-1.5 2 1.2.3 1.9 1.2 1.9 2.4 0 1.6-1.3 2.5-3.5 2.5H7V6zm2.4 3.7h2.3c.7 0 1.2-.3 1.2-.9s-.5-.9-1.2-.9H9.4v1.8zm0 3.8h2.6c.8 0 1.3-.4 1.3-1s-.5-1-1.3-1H9.4v2z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes("jquery")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#0769ad">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.8 8.6c-.6 1.6-1.9 2.8-3.5 3.3v1.3a4.5 4.5 0 0 1-2.7-1.1l.9-1.1c.5.5 1.1.7 1.8.7v-3c-1.8-.4-3-1.6-3-3.2 0-1.8 1.4-3.1 3.5-3.1s3.4 1.3 3.5 3.1h-1.6c-.1-1-.8-1.7-1.9-1.7s-1.8.6-1.8 1.5c0 .8.6 1.3 1.8 1.6v3.2c1.2-.3 2.1-1.2 2.5-2.4z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes("styled")) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <circle cx="9" cy="9" r="6" fill="#db7093" opacity="0.85" />
        <circle cx="15" cy="15" r="6" fill="#ffa07a" opacity="0.85" />
      </svg>
    );
  }

  if (norm === "html5") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#e34f26">
        <path d="M3 2l1.6 18.2 7.4 2.1 7.4-2.1L21 2H3zm14.4 5.3l-.3 3.3h-7.7l.2 2.7h7.2l-.6 6.3-4.5 1.3-4.5-1.3-.3-3.7h2.5l.2 1.8 2.1.6 2.1-.6.2-2.5H7.3l-.6-7.4h10.7z" />
      </svg>
    );
  }

  if (norm === "css3") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#1572b6">
        <path d="M3 2l1.6 18.2 7.4 2.1 7.4-2.1L21 2H3zm14.4 5.3l-.3 3.3h-7.7l.2 2.7h7.2l-.6 6.3-4.5 1.3-4.5-1.3-.3-3.7h2.5l.2 1.8 2.1.6 2.1-.6.2-2.5H7.3l-.6-7.4h10.7z" />
      </svg>
    );
  }

  if (norm.includes("node")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#339933">
        <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 3.2L5.5 8.9v7.2L12 19.8l6.5-3.7V8.9L12 5.2z" />
      </svg>
    );
  }

  if (norm.includes("express")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
        <path d="M4 8l5 8M9 8l-5 8M14 8h6v2h-4v2h3v2h-3v2h4" />
      </svg>
    );
  }

  if (norm.includes("sql") || norm.includes("database")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00758f" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }

  if (norm.includes("firebase")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#ffca28">
        <path d="M4.5 18.5L2 6l5 4 4.5-7.5 4 16z" fill="#ffa000" />
        <path d="M19.5 18.5L22 6l-6.5 6.5z" fill="#f57c00" />
        <path d="M4.5 18.5l15 0-7.5 4z" fill="#ffca28" />
      </svg>
    );
  }

  if (norm.includes("mongo")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#47a248">
        <path d="M12 2C8 6 6 10 6 15c0 4 3 7 6 7s6-3 6-7c0-5-2-9-6-15z" />
      </svg>
    );
  }

  if (norm.includes("postgres")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#336791" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12c2-3 6-3 8 0M9 16c1.5 1 4.5 1 6 0" />
      </svg>
    );
  }

  if (norm === "git" || norm.includes("github")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#f05032" strokeWidth="2">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M6 9v6M9 6h4a4 4 0 0 1 4 4v5" />
      </svg>
    );
  }

  if (norm.includes("actions") || norm.includes("ci/cd") || norm.includes("runner")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#2088ff" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }

  if (norm.includes("nginx")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#009639">
        <path d="M12 2l10 5.8v11.6L12 22 2 17.4V5.8L12 2zm-5 6v8l10-8v8" stroke="#009639" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm.includes("figma")) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <circle cx="15" cy="12" r="3" fill="#0acf83" />
        <rect x="6" y="3" width="6" height="6" rx="3" fill="#f24e1e" />
        <rect x="12" y="3" width="6" height="6" rx="3" fill="#ff7262" />
        <rect x="6" y="9" width="6" height="6" rx="3" fill="#a259ff" />
        <rect x="6" y="15" width="6" height="6" rx="3" fill="#1abcfe" />
      </svg>
    );
  }

  if (norm.includes("postman")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#ff6c37">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 8l-6 4 6 4V8z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes("vscode") || norm.includes("vs code")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#007acc">
        <path d="M17.5 2.5L7 11.2l-3.5-2.7L2 9.5 5.5 12 2 14.5l1.5 1 3.5-2.7L17.5 21.5l4.5-2.2V4.7l-4.5-2.2zm0 4.8v9.4L11 12l6.5-4.7z" />
      </svg>
    );
  }

  if (norm.includes("intellij") || norm.includes("maven") || norm.includes("pm2")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#fe315d" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 8h8M8 12h5M8 16h8" />
      </svg>
    );
  }

  // Default tech chip icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
