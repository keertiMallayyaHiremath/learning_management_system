export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to LMS
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Learning Management System
      </p>
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Get Started</h2>
          <div className="space-x-4">
            <a 
              href="/auth/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </a>
            <a 
              href="/auth/register" 
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Register
            </a>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="text-left space-y-2">
            <li>✅ JWT Authentication</li>
            <li>✅ Video Learning with Progress Tracking</li>
            <li>✅ Structured Course Content</li>
            <li>✅ YouTube Video Integration</li>
            <li>✅ Responsive Design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}