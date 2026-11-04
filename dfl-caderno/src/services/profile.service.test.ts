import { describe, expect, it } from 'vitest';
import { toProfile } from './profile.service';

describe('toProfile', () => {
  it('mantém id, nome e tema quando a linha é válida', () => {
    expect(
      toProfile({
        id: 'user-1',
        name: 'Ana',
        theme: 'dark',
      }),
    ).toEqual({
      id: 'user-1',
      name: 'Ana',
      theme: 'dark',
    });
  });

  it('recusa tema fora de light e dark', () => {
    expect(() =>
      toProfile({
        id: 'user-1',
        name: 'Ana',
        theme: 'sepia',
      }),
    ).toThrow(/Tema inválido/);
  });
});
