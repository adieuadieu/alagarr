export default (middlewareList = [], initialData, ...args) =>
  middlewareList.reduce((applied, middleware) => middleware(applied, ...args), initialData)
