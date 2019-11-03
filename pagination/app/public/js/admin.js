const deleteProduct = async (buttonElement) => {
  const productId = buttonElement.parentNode.querySelector('[name=id]').value;
  const csrfToken = buttonElement.parentNode.querySelector('[name=_csrf]').value;
  const productElement = buttonElement.closest('article');

  try {
    await fetch(`/admin/product/${productId}`, {
      method: 'delete',
      headers: { 'csrf-token': csrfToken }
    });
  } catch (e) {
    return console.log(e);
  }
  productElement.remove();
};
