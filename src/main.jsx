import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import errorImage from './assets/Error/Error.png';
import Home from './Home/Home.jsx';
import Products from './Products/Products.jsx';
import RequireAuth from "./routes/RequireAuth.jsx";
import ProductCardDetails from './Products/ProductCardDetails.jsx';
import CategoryProducts from './Choose-By-Category/CategoryProducts.jsx';
import Login from './login-registration/Login.jsx';
import Registration from './login-registration/Registration.jsx';
import RegistrationByAdmin from './login-registration/RegistrationByAdmin.jsx';
import AccountDetails from './login-registration/AccountDetails.jsx';
import GuestOnly from './routes/GuestOnly.jsx';
import EditAccount from './login-registration/EditAccount.jsx';
import SuperadminOnly from './routes/SuperadminOnly.jsx';
import Checkout from './Checkout/Checkout.jsx';
import OrderSuccess from './Checkout/OrderSuccess.jsx';
import Orders from './Admin-panel/Orders.jsx';
import About from './CommonComponents/About.jsx';
import AdminOnly from './routes/AdminOnly.jsx';
import ManageProducts from './Admin-panel/ManageProducts.jsx';
import AddProducts from './Admin-panel/AddProducts.jsx';
import EditProduct from './Admin-panel/EditProduct.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <div className='flex items-center justify-center'>
      <img src={errorImage} alt='error-image'></img>
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
        element: <RequireAuth><ProductCardDetails></ProductCardDetails></RequireAuth>,
        loader: ({ params }) => {
          return fetch(`${import.meta.env.VITE_API_URL}/products/${params.id}`)
        }
      },
      {
        path: "/category/:slug",
        element: <CategoryProducts></CategoryProducts>
      },
      {
        path: "/login",
        element: <GuestOnly to="/account" autoRedirect={true}><Login></Login></GuestOnly>
      },
      {
        path: "/register",
        element: <GuestOnly to="/account" autoRedirect={false}><Registration></Registration></GuestOnly>
      },
      {
        path: "/admin-register",
        element: <SuperadminOnly><RegistrationByAdmin></RegistrationByAdmin></SuperadminOnly>
      },
      {
        path: "/account",
        element: <RequireAuth><AccountDetails></AccountDetails></RequireAuth>
      },
      {
        path: "/account/edit",
        element: (
          <RequireAuth>
            <EditAccount />
          </RequireAuth>
        )
      },
      {
        path: '/checkout',
        element: <RequireAuth><Checkout /></RequireAuth>
      },
      {
        path: "/payment/success",
        element: (
          <RequireAuth>
            <OrderSuccess />
          </RequireAuth>
        ),
        loader: ({ request }) => {
          const url = new URL(request.url);
          const orderId = url.searchParams.get("orderId");
          return { orderId };
        },
      },
      {
        path: "/orderlist",
        element: (<RequireAuth>
          <AdminOnly>
            <Orders></Orders>
          </AdminOnly>
        </RequireAuth>)
      },
      {
        path: "/admin/products",
        element: (
          <RequireAuth>
            <AdminOnly>
              <ManageProducts />
            </AdminOnly>
          </RequireAuth>
        ),
      },
      {
        path: "/admin/addproduct",
        element: (
          <RequireAuth>
            <AdminOnly>
              <AddProducts />
            </AdminOnly>
          </RequireAuth>
        ),
      },
      {
        path: "/admin/products/:id/edit",
        element: (
          <RequireAuth>
            <AdminOnly>
              <EditProduct />
            </AdminOnly>
          </RequireAuth>
        ),
      },
      {
        path: "/about",
        element: <About></About>
      }
    ],
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
  </StrictMode>,
)
