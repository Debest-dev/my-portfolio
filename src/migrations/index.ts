import * as migration_20261115_015615_initial from './20261115_015615_initial';
import * as migration_20261115_172340_add_newest_first_and_optional_alt from './20261115_172340_add_newest_first_and_optional_alt';

export const migrations = [
  {
    up: migration_20261115_015615_initial.up,
    down: migration_20261115_015615_initial.down,
    name: '20261115_015615_initial',
  },
  {
    up: migration_20261115_172340_add_newest_first_and_optional_alt.up,
    down: migration_20261115_172340_add_newest_first_and_optional_alt.down,
    name: '20261115_172340_add_newest_first_and_optional_alt'
  },
];
