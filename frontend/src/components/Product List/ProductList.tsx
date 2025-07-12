import { JSX } from 'react';
import ProductCartItem from '../ProductCartItem/ProductCartItem';

export default function ProductList(): JSX.Element {
  const products = [
    {
      image: 'assets/img/fruite-item-5.jpg',
      title: 'Grapes',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-5.jpg',
      title: 'Grapes',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-2.jpg',
      title: 'Raspberries',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-4.jpg',
      title: 'Apricots',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-3.jpg',
      title: 'Banana',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-1.jpg',
      title: 'Oranges',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-2.jpg',
      title: 'Raspberries',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
    {
      image: 'assets/img/fruite-item-5.jpg',
      title: 'Grapes',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt',
      price: 4.99,
    },
  ];

  return (
    <div id="tab-1" className="tab-pane fade show p-0 active">
      <div className="row g-4">
        <div className="col-lg-12">
          <div className="row g-4">
            {products.map((product, index) => (
              <ProductCartItem
                key={index}
                image={product.image}
                title={product.title}
                description={product.description}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
