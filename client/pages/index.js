import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
   console.log('I am in the component', currentUser);
   return currentUser ? (
      <h1>Are you signed in</h1>
   ) : (
      <h1>Are you not signed in</h1>
   );
};

LandingPage.getInitialProps = async (context) => {
   console.log('LANDING PAGE');
   const client = buildClient(context);
   const { data } = await client.get('/api/users/currentuser');
   return data;
};

export default LandingPage;

// Request from a component = Always issues from the browser, so use a domain of ''.
// Request from getInitialProps = Might be executed from the client ot the server! Need to figure out what our env is so we can use the correct domain.
