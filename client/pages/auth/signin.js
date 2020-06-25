import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { doRequest, errors } = useRequest({
      url: '/api/users/signin',
      method: 'post',
      body: {
         email,
         password,
      },
      onSuccess: () => Router.push('/'),
   });

   const onSubmit = async (event) => {
      event.preventDefault();

      await doRequest();
   };

   return (
      <div className="container">
         <form onSubmit={onSubmit}>
            <h1>Sign in</h1>
            <div className="form-group">
               <label>Email address</label>
               <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
               />
            </div>

            <div className="form-group">
               <label>Password</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
               />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary">
               Sign in
            </button>
         </form>
      </div>
   );
};
