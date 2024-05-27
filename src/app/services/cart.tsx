export const addToCart = (product: { id: any; handle: string; }, quantity = 1) => {
  if (typeof window !== 'undefined') { // تأكد من أن هذا يتم تشغيله فقط في المتصفح
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : {};
    let id = product.id;

    if (cart[id]) {
      cart[id].quantity += quantity;
    } else {
      cart[id] = {
        ...product,
        quantity: quantity
      };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('lastAddedProductId', product.handle);
    console.log(JSON.stringify(cart));
  }
};
