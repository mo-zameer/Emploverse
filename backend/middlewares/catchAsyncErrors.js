export const catchAsyncErrors = (fun) => {
    return (req, res, next) => {
      Promise.resolve(fun(req, res, next)).catch(next);
    };
};

/*
"Promise.resolve(fun(req, res, next)).catch(next);""
is the core of the catchAsyncErrors function. It wraps the provided "fun" in a Promise.resolve() call. This ensures that the function is treated as a promise, even if it doesn't explicitly return one.
If the "fun" returns a promise, the Promise.resolve() call will resolve with the same value.
If the "fun" doesn't return a promise, Promise.resolve() will create a new resolved promise with the value returned by the function.
The .catch(next) part of the code handles any errors that might occur within the theFunction. If an error is thrown, it will be caught by the .catch() method and passed to the next function. This will trigger the error handling middleware in your Express.js application.
*/