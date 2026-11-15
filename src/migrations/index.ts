import * as migration_20261115_015615_initial from './20261115_015615_initial';

export const migrations = [
  {
    up: migration_20261115_015615_initial.up,
    down: migration_20261115_015615_initial.down,
    name: '20261115_015615_initial'
  },
];
