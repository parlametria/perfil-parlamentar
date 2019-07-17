import { Injectable } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UpdateService {

  constructor(
    private swUpdate: SwUpdate,
    private snackbar: MatSnackBar) {

    if (!this.swUpdate.isEnabled) {
      console.log('SW indisponível');
    } else {
      console.log('SW disponível');
    }

    this.swUpdate.available.subscribe(event => {
      console.log('Versão instalada:', event.current);
      console.log('Versão disponível:', event.available);

      const snack = this.snackbar.open('Nova versão disponível', 'Atualizar');

      snack
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });

    });

  }

}
