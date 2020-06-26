import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

const id = '5ef48a603710de00235b8eb0';

it('marks an order as cancelled', async () => {
   // create a ticket with Ticket Model
   const ticket = Ticket.build({
      id,
      title: 'concert',
      price: 20,
   });
   await ticket.save();
   // make a request to create an order
   const user = global.signin();
   const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);
   //  make a request to cancel the order
   await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);
   const updatedOrder = await Order.findById(order.id);
   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
   // create a ticket with Ticket Model
   const ticket = Ticket.build({
      id,
      title: 'concert',
      price: 20,
   });
   await ticket.save();
   // make a request to create an order
   const user = global.signin();
   const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);
   //  make a request to cancel the order
   await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);

   expect(natsWrapper.client.publish).toHaveBeenCalled();
});
