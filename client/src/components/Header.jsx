import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ refFunc }) {

    const [navVisible, setNavVisible] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setNavVisible(!navVisible);
    }

    const navHome = () => {
        if (navVisible) {
            toggleNav();
        }
        navigate('/');
    }

    return (
        <div className='w-[100vw] border-b-1 border-gray-400 shadow-sm sticky top-0 z-50 flex flex-row text-black items-center mb-2 bg-white'>
            <div 
                className='flex flex-row w-fit text-left p-2 items-center border-r-1 border-gray-400 hover:cursor-pointer'
                onClick={() => {
                    navHome()
                    refFunc()
                }}
            >
                <div className='bg-[url(/images/trefoil.jpg)] bg-cover bg-center w-[48px] h-[48px]'></div>
                <div className='text-4xl font-medium px-2'>Knot Games</div>
            </div>
            <div 
                className='text-xl font-small px-2 hover:text-gray-500 hover:cursor-pointer'
                onClick={() => {
                    navigate("/mosaic-maker")
                    refFunc()
                }}
            >
                Mosaic Maker
            </div>
            <div 
                className='text-xl font-small px-2 hover:text-gray-500 hover:cursor-pointer'
                onClick={() => {
                    navigate("/knotting")
                    refFunc()
                }}
            >
                Knotting Unknotting Game
            </div>
        </div>
    )
}

export default Header;

