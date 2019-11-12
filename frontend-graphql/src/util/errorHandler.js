export const handleError = resData => {
  if ((resData.errors || []).length) {
    throw new Error(resData.errors.map(({ message, validationErrors }) =>
      validationErrors
        ? validationErrors
        .map(({ constraints }) => Object.values(constraints).join(', '))
        .join(', ')
        : message
    ))
  }
};
