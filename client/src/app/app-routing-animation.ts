import { trigger, animate, style, query, transition } from '@angular/animations';

export const routeAnimation =
  trigger('routeAnimation', [
    transition('* => *', [
        query(
          ':enter',
          [style({ opacity: 0, position: 'absolute', width: '100%', height: '100%' })],
          { optional: true }
        ),
        query(
          ':leave',
          [style({ opacity: 1, position: 'absolute', width: '100%', height: '100%'}), animate('0.25s ease-out', style({ opacity: 0 }))],
          { optional: true }
        ),
        query(
          ':enter',
          [animate('0.25s ease-in', style({ opacity: 1, position: 'absolute', width: '100%', height: '100%' }))],
          { optional: true }
        )
      ])
  ]);
