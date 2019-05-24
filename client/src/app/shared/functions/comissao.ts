export function getClassCargo(cargo: string) {
  if (cargo !== undefined && cargo !== '') {
    if (cargo === 'Titular') {
      return 'badge-gray';
    } else if (cargo === 'Suplente') {
      return 'badge-white';
    } else {
      return 'badge-dark-gray';
    }
  } else {
    return '';
  }
}
