import { trigger, animate, style, query, transition } from '@angular/animations';

export const routeAnimation =
  trigger('routeAnimation', [
    transition( '* => *', [

      query(':enter',
          [
              style({ opacity: 0 })
          ],
          { optional: true }
      ),

      query(':leave',
          [
              style({ opacity: 1 }),
              animate('0.2s', style({ opacity: 0 }))
          ],
          { optional: true }
      ),

      query(':enter',
          [
              style({ opacity: 0 }),
              animate('0.2s', style({ opacity: 1 }))
          ],
          { optional: true }
      )

  ])
  ]);
