import { motion } from "framer-motion";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >

      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto relative px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-lg text-gray-600">Page Not Found</p>
              <p className="mt-2 text-sm text-gray-500">You may have followed an invalid link.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/donor/dashboard" className="rounded-xl bg-[#00615F] px-4 py-2.5 text-sm font-bold text-white">Back to Dashboard</Link>
                <Link to="/" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700">Go Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
