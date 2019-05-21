export function getClassCargo(cargo: string) {
  if (cargo !== undefined && cargo !== '') {
    if (cargo === 'Titular') {
      return 'badge-dark-gray';
    } else if (cargo === 'Suplente') {
      return 'badge-gray';
    } else {
      return 'badge-white';
    }
  } else {
    return '';
  }
}
