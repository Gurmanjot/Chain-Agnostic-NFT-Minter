import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className='z-[10]'>
            <div className="rounded-b-lg flex items-center justify-between w-full h-20 px-12">
                <Link className="flex-1 font-semibold text-4xl text-green-600 hover:text-green-500" to='/'>
                    <div className='flex justify-center pl-56'><img src="https://ik.imagekit.io/bayc/assets/bayc-logo.png" className='h-14 w-48' /></div>
                </Link>
                <div className="">
                    <ConnectButton chainStatus="icon" showBalance={false}/>
                </div>
            </div>
        </div>
    )
}

export default Navbar;