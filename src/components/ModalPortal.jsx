// src/components/ModalPortal.jsx
import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
  // This makes sure the modal renders directly inside <body>,
  // instead of being trapped inside smaller parent containers
  return createPortal(children, document.body);
}