import React from "react";
import { SearchHint } from "./ui-kit";

export const MobileTopBar = ({ onMenuToggle, onSearch, showSearch = true }) => (
  <div className="mobile-topbar">
    <button
      className="hamburger-btn"
      onClick={onMenuToggle}
      aria-label="Open navigation menu"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </button>
    <div className="mobile-brand">
      <div className="logo-mark">V</div>
      <div className="logo-name">Vellum</div>
    </div>
    {showSearch && onSearch && (
      <SearchHint onClick={onSearch} compact />
    )}
  </div>
);