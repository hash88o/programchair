import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { urls } from '../utils/urlList';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // token : token is available @ localstorage
  // token string = either we will have token or not.
  // if there is token then getITem will give us the value
  // if not then we need a ''

  // it should take us to landing page.
  // does it have constructor. : NO
  // we need router service.

  const router = inject(Router);

  let token = localStorage.getItem('token');

  console.log('inisde the interceptor');
  // urls.forEach((e) => {
  //   if (e.includes(req.url)) return next(req);
  // });
  for (const e of urls) {
    console.log('inside the for loop');
    console.log(req.url.includes(e) + req.url);
    if (req.url.includes(e) && req.method != 'GET') {
      return next(req); // Forward the request unmodified
    } else {
      console.log('inside for wala else');
    }
  }
  // how can I confirm that the request is raised for
  // login or register.
  //req.url ==> contains login or register then ==> return next(req)

  if (token) {
    // add one header X-Auth-Token : token
    // request object can't be manipulated
    /// it is immubtable.
    // req.headers.set('X-Auth-Token',token)
    console.log('inside the if token condition');
    let modifiedReq = req.clone({
      // whaterver the changes we want those things we will pass it to the json object.
      headers: req.headers.set('X-Auth-Token', token),
    });
    return next(modifiedReq);
    // response manipulation would be done via pipe method.
    // addition of token in header
  } else {
    /// bye bye to landing.
    router.navigate(['/']);
    throw new Error('unauthorized access');
    // return next(req);
  }

  // if token is available ===> then we will add it and move to next
  // if not take the user back to landing page.
};

// req : httprequest:
// next : next interceptor or backendApp
