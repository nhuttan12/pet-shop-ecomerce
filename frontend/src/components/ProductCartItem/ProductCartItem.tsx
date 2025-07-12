import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { JSX } from 'react';

type ProductCartItemProps = {
  image: string;
  title: string;
  description: string;
  price: number;
};

export default function ProductCartItem({
  image,
  price,
  title,
  description,
}: ProductCartItemProps): JSX.Element {
  return (
    <div className="col-md-6 col-lg-4 col-xl-3">
      <div className="rounded position-relative fruite-item">
        <div className="fruite-Image">
          <Image src={image} className="Image-fluid w-100 rounded-top" alt="" />
        </div>
        <div
          className="text-white bg-secondary px-3 py-1 rounded position-absolute"
          style={{ top: '10px', left: '10px' }}
        >
          Fruits
        </div>
        <div className="p-4 border border-secondary border-top-0 rounded-bottom">
          <h4>{title}</h4>
          <p>{description}</p>
          <div className="d-flex justify-content-between flex-lg-wrap">
            <p className="text-dark fs-5 fw-bold mb-0">{price}</p>
            <a
              href="#"
              className="btn border border-secondary rounded-pill px-3 text-primary"
            >
              {/* <i className="fa fa-shopping-bag me-2 text-primary"></i>  */}
              <FontAwesomeIcon icon={faShoppingBag} className='me-2 text-primary'/>
              Add to cart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
