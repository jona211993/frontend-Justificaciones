import { Link } from 'react-router-dom';

export const Button = (props) => {
  return (
    <Link to={props.to} className='bg-green-600 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-green-300 duration-500'>
      <button>
        {props.children}
      </button>
    </Link>
  );
};
