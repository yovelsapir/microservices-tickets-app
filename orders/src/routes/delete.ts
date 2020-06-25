import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
   requireAuth,
   NotFoundError,
   NotAuthorizedError,
   OrderStatus,
} from '@yovelsapir_sgtickets/common';

const router = express.Router();

router.delete(
   '/api/orders/:orderId',
   requireAuth,
   async (req: Request, res: Response) => {
      const { orderId } = req.params;

      const order = await Order.findById(orderId);

      if (!order) {
         throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
         throw new NotAuthorizedError();
      }

      order.status = OrderStatus.Cancelled;
      await order.save();

      // publishing an event saying this was cancelled
      res.status(204).send(order);
   }
);

export { router as deleteOrderRouter };
