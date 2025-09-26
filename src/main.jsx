import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import error from './assets/Error.png'
import Home from './Home/Home.jsx';
import Products from './Products/Products.jsx';
import ProductCardDetails from './Products/ProductCardDetails.jsx';
import CategoryProducts from './Choose-By-Category/CategoryProducts.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <div className='flex items-center justify-center'>
      <img src={error} alt='error-image'></img>
    </div>,
    loadingElement: <div className='flex items-center justify-center'>
      <span className="loading loading-spinner text-primary"></span>
      <span className="loading loading-spinner text-secondary"></span>
      <span className="loading loading-spinner text-accent"></span>
      <span className="loading loading-spinner text-neutral"></span>
      <span className="loading loading-spinner text-info"></span>
      <span className="loading loading-spinner text-success"></span>
      <span className="loading loading-spinner text-warning"></span>
      <span className="loading loading-spinner text-error"></span>
    </div>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/products",
        element: <Products></Products>
      },
      {
        path: "/products/:id",
        element: <ProductCardDetails></ProductCardDetails>,
        loader: ({ params }) => {
          return fetch(`${import.meta.env.VITE_API_URL}/products/${params.id}`)
        }
      },
      {
        path: "/category/:slug",
        element: <CategoryProducts></CategoryProducts>
      }
    ],
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
  </StrictMode>,
)
