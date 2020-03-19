import faker from 'faker';

import { getLabel } from '~/helpers/HeroStatuses';

describe('HeroStatuses helper', () => {
  it('should be able to get status label', () => {
    const statuses = [
      { key: 'fighting', label: 'Combatendo' },
      { key: 'out_of_combat', label: 'Fora de combate' },
      { key: 'patrolling', label: 'Patrulhando' },
      { key: 'resting', label: 'Descansando' },
    ];

    statuses.forEach(({ key, label }) => {
      expect(getLabel(key)).toBe(label);
    });
  });

  it('should not be able to get a status label', () => {
    expect(getLabel(faker.lorem.word())).toBe('');
  });
});
