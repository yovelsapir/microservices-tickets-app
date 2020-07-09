import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
   const ticketList = tickets.map((ticket) => (
      <tr key={ticket.id}>
         <td>{ticket.title}</td>
         <td>{ticket.price}</td>
         <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
               <a>View</a>
            </Link>
         </td>
      </tr>
   ));

   return (
      <div>
         <h1>Tickets</h1>
         <table className="table">
            <thead>
               <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Link</th>
               </tr>
            </thead>

            <tbody>{ticketList}</tbody>
         </table>
      </div>
   );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
   const { data } = await client.get('/api/tickets');
   return { tickets: data };
};

export default LandingPage;

// Request from a component = Always issues from the browser, so use a domain of ''.
// Request from getInitialProps = Might be executed from the client ot the server! Need to figure out what our env is so we can use the correct domain.
