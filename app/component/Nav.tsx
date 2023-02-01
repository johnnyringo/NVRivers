import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";



export default function Nav() {
    const user = useOptionalUser();
  return (
          <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg width="90px" height="90px" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 29C11.7614 29 14 26.7614 14 24C14 26.7614 16.2386 29 19 29C21.7614 29 24 26.7614 24 24C24 26.7614 26.2386 29 29 29C31.7614 29 34 26.7614 34 24C34 26.7614 36.2386 29 39 29C41.7614 29 44 26.7614 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 26.7614 6.23858 29 9 29Z" fill="blue" stroke="black" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28 13C28 15.2091 26.2091 17 24 17C21.7909 17 20 15.2091 20 13C20 10.7909 24 4 24 4C24 4 28 10.7909 28 13Z" fill="blue" stroke="black" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
          <span className="font-semibold text-xl tracking-tight">N NEVADA RIVERS</span>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div className="w-full hidden md:block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a href="/dashboard" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Carson River
            </a>
            <a href="/TruckeeDashboard" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Truckee River
            </a>
            <a href="/WalkerDashboard" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Walker River
            </a>
            <a href="/HumboldtDashboard" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Humboldt River
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
              Lakes / Reservoirs
            </a>
          </div>
          <div>
            <a href="https://buy.stripe.com/3csaIc8L02KZ05a289" className="mr-4 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Donate</a>
          </div>
          <div>
          {user ? (
          <div className="flex gap-4 h-8">
          <Form action="/logout" method="post">
          <button
            type="submit"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
          >
            Logout
          </button>
        </Form>
      <div className="flex justify-end">
      <a href="/account">
          <button className="bg-transparent">
            <img className="w-8 h-8 rounded-full" src="https://www.projectfansler.com/wp-content/uploads/2020/10/image-300x300.jpeg" className="w-8 h-8 rounded-full" alt="Avatar" />
            
          </button>
          </a>
        </div></div>
        ) : (
        <Link
        to="/login"
        className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
      >
        Log In
      </Link>)}
          </div>
          </div>
        
      </nav>
        )
      }
