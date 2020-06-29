import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@yovelsapir_sgtickets/common';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
   // create an instacne of the listener
   const listener = new TicketUpdatedListener(natsWrapper.client);
   // create and save a ticket
   const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
   });
   await ticket.save();

   // create a fake data event
   const data: TicketUpdatedEvent['data'] = {
      version: ticket.version + 1,
      id: ticket.id,
      title: 'new concert',
      price: 999,
      userId: new mongoose.Types.ObjectId().toHexString(),
   };

   // create a fake message object
   // @ts-ignore
   const msg: Message = {
      ack: jest.fn(),
   };

   // return all of this stuff

   return { listener, data, ticket, msg };
};

it('finds, updates, and saves a ticket', async () => {
   const { data, listener, msg, ticket } = await setup();

   await listener.onMessage(data, msg);

   const updatedTicket = await Ticket.findById(ticket.id);

   expect(updatedTicket!.title).toEqual(data.title);
   expect(updatedTicket!.price).toEqual(data.price);
   expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
   const { data, listener, msg } = await setup();

   await listener.onMessage(data, msg);

   expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
   const { msg, data, listener, ticket } = await setup();

   data.version = 10;
   try {
      await listener.onMessage(data, msg);
   } catch (err) {}

   expect(msg.ack).not.toHaveBeenCalled();
});
