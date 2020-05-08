const { is_command, is_able, sanitize_cmd } = require("../src/helpers");

test('is_command works', () => {
    expect(is_command('!cool')).toBe(true);
    expect(is_command('!!')).toBe(false);
    expect(is_command('/cool')).toBe(true);
    expect(is_command('!')).toBe(false);
    expect(is_command('/')).toBe(false);
    expect(is_command('!c')).toBe(true);
    expect(is_command('!!co')).toBe(false);
});

test('is_able_works', () => {
    expect(is_able('GOD', 'NOBODY')).toBe(true);
    expect(is_able('GOD', 'GOD')).toBe(true);
    expect(is_able('NOBODY', 'NoBoDy')).toBe(true);
    expect(is_able('NOBODY', 'USER')).toBe(false);
    expect(is_able('USER', 'USER')).toBe(true);
    expect(is_able('NOBODY', 'GOD')).toBe(false);
    expect(is_able('NOBODY', 'USER')).toBe(false);
    expect(is_able('USER', 'GOD')).toBe(false);
    expect(is_able('someone that is not a role', 'nobody')).toBe(false);
});

test('sanitize_cmd works', () => {
    expect(sanitize_cmd('!!!!c!cool')).toBe('ccool');
    expect(sanitize_cmd('!cool')).toBe('cool');
    expect(sanitize_cmd('/c')).toBe('c');
    expect(sanitize_cmd('/c!cool')).toBe('ccool');
    expect(sanitize_cmd('!!!!')).toBe('');
    expect(sanitize_cmd('////c!l')).toBe('cl');
    expect(sanitize_cmd('/c!c')).toBe('cc');
    expect(sanitize_cmd('!..!!!c!')).toBe('..c');

})

