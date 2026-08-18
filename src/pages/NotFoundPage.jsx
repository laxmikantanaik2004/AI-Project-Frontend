import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="text-center mt-6">
      <h2 className="page-title">Page Not Found</h2>
      <p className="text-muted mt-2">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary mt-3">
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}
