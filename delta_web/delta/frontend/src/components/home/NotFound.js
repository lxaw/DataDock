/**
 * Delta Project
 *
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 *
 * NotFound.js
 *
 * Simple page that just gets displayed any time a page cannot be found.
 */
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <h1>404 Error</h1>
      <p>It looks like the page you are looking for doesn't exist.</p>
    </div>
  );
}
