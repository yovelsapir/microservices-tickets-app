import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
   requireAuth,
   NotFoundError,
   NotAuthorizedError,
   OrderStatus,
} from '@yovelsapir_sgtickets/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
   '/api/orders/:orderId',
   requireAuth,
   async (req: Request, res: Response) => {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate('ticket');

      if (!order || !order.ticket) {
         throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
         throw new NotAuthorizedError();
      }

      order.status = OrderStatus.Cancelled;
      await order.save();

      // publishing an event saying this was cancelled
      new OrderCancelledPublisher(natsWrapper.client).publish({
         id: order.id,
         ticket: {
            id: order.ticket.id,
         },
         version: order.version,
      });
      res.status(204).send(order);
   }
);

export { router as deleteOrderRouter };
