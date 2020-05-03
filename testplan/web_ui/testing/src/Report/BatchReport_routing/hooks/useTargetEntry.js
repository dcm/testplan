import { useParams } from 'react-router-dom';
import uriComponentCodec from '../utils/uriComponentCodec';
import useReportState from './useReportState';
import { actionTypes } from '../state';

export default function useTargetEntry(entries) {
  // Assume:
  // - The route that was matched === "/aaa/bbb/ccc/:id"
  // - The URL that matched       === "/aaa/bbb/ccc/12345"
  // Then the value of the following variables are:
  // *   url = "/aaa/bbb/ccc/12345"
  // *  path = "/aaa/bbb/ccc/:id"
  // *    id = "12345"
  const { id: encodedID } = useParams();
  const [ aliases, setUriHashPathComponentAlias ] = useReportState(
    actionTypes.URI_HASH_ALIASES, 'setUriHashPathComponentAlias'
  );

  // gotta run hooks before we do this check since they must run unconditionally
  if(!Array.isArray(entries)) return null;

  // ths incoming `encodedID` may be URL-encoded and so it won't match
  // `entry.name` in the `entries` array, so we grab whatever `id` is actually
  // an alias for, and use that to find our target `entry` object.
  let decodedID = aliases.get(encodedID);

  // on refresh on an aliased path, the `componentAliases` will be empty so we
  // need to fill it with the aliased component
  if(!decodedID) {
    decodedID = uriComponentCodec.decode(encodedID);
    setUriHashPathComponentAlias(decodedID, encodedID);
  }
  return entries.find(e => decodedID === e.name);
}
