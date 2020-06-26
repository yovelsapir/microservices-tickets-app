import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

const id = '5ef48a603710de00235b8eb0';

it('returns an error if the ticket does not exist', async () => {
   const ticketId = mongoose.Types.ObjectId();

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId })
      .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
   const ticket = Ticket.build({ id, title: 'concert', price: 20 });

   await ticket.save();

   const order = Order.build({
      ticket,
      userId: id,
      status: OrderStatus.Created,
      expiresAt: new Date(),
   });

   await order.save();

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({
         ticketId: ticket.id,
      })
      .expect(400);
});

it('reserves a ticket', async () => {
   const ticket = Ticket.build({ id, title: 'concert', price: 20 });
   await ticket.save();

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);
});

it('emits an order created event', async () => {
   const ticket = Ticket.build({ id, title: 'concert', price: 20 });
   await ticket.save();

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

   expect(natsWrapper.client.publish).toHaveBeenCalled();
});
