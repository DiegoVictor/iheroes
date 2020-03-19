export const statuses = [
  { key: 'fighting', label: 'Combatendo' },
  { key: 'out_of_combat', label: 'Fora de combate' },
  { key: 'patrolling', label: 'Patrulhando' },
  { key: 'resting', label: 'Descansando' },
];

export function getLabel(key) {
  try {
    const { label } = statuses.find(s => s.key === key);
    return label;
  } catch (err) {
    return '';
  }
}
