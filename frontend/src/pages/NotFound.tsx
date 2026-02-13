import { Home, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-cyan-400 mr-2" />
          <span className="text-xl font-semibold">MindBuddy</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => (window.location.href = '/')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/50"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => (window.location.href = '/contact')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 rounded-lg font-medium hover:bg-slate-600 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                Home
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="/counseling"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Counseling
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="/resources"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Resources
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="/community"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Community
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
