import uriComponentCodec from '../uriComponentCodec';
import { reverseMap } from '../utils';

const reserved2PctEncodedMap = new Map([
  [ 'Dow is down 70%', 'Dow is down 70%25' ],
  [ 'è stato bene?', 'è stato bene%3f' ],
  [ '#woke', '%23woke' ],
  [ 'buy:5', 'buy%3a5' ],
  [ 'In / Out', 'In %2f Out' ],
  [ '@realDonaldTrump', '%40realDonaldTrump' ],
  [ '>=]', '>%3d%5d' ],
  [ '<:-[', '<%3a-%5b' ],
  [ 'help!', 'help%21' ],
  [ '$20', '%2420' ],
  [ '&ref', '%26ref' ],
  [ "'ciao'", '%27ciao%27' ],
  [ '(secret)', '%28secret%29' ],
  [ '1=="1"', '1%3d%3d"1"' ],
  [ 'end;', 'end%3b' ],
  [ '+3', '%2b3' ],
  [ '*ptr', '%2aptr' ],
  [ 'first,second', 'first%2csecond' ],
]);
const pctEncoded2ReservedMap = reverseMap(reserved2PctEncodedMap);

describe('uriComponentCodec', () => {
  it('checks that the mock component maps are 1-1 reversible', () => {
    expect(reserved2PctEncodedMap.size).toBe(pctEncoded2ReservedMap.size);
  });
  it.each(Array.from(reserved2PctEncodedMap))(
    '(%#) correctly encodes "%s" to "%s"', (raw, encoded) => {
      expect(uriComponentCodec.encode(raw)).toBe(encoded);
  });
  it.each(Array.from(pctEncoded2ReservedMap))(
    '(%#) correctly decodes "%s" to "%s"', (encoded, raw) => {
    expect(uriComponentCodec.decode(encoded)).toBe(raw);
  });
});
