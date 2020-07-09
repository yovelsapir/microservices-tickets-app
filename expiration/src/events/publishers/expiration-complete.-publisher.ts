import {
   Publisher,
   Subjects,
   ExpirationCompleteEvent,
} from '@yovelsapir_sgtickets/common';

export class ExpirationCompletePublisher extends Publisher<
   ExpirationCompleteEvent
> {
   readonly subject = Subjects.ExpirationComplete;
}
