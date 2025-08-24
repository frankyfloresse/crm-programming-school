import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/constants';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-base-content mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-base-content/70 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-x-4">
          <Link to={ROUTES.HOME} className="btn btn-primary">
            Go to Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-ghost"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-12 text-base-content/50">
          <p className="text-sm">
            If you think this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}