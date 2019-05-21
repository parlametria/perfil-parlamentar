export function getClassCargo(cargo: string) {
  console.log('a');
  if (cargo !== undefined && cargo !== '') {
    if (cargo === 'Titular') {
      return 'badge-black';
    } else if (cargo === 'Suplente') {
      return 'badge-white';
    } else {
      return 'badge-purple';
    }
  } else {
    return '';
  }
}
