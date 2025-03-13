import { Link } from "react-router-dom"
import Header from "../components/Header"

const NotFoundPage = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go Home
        </Link>
      </div>
    </>
  )
}

export default NotFoundPage

