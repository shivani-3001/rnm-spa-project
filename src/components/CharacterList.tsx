import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { fetchCharacters } from '../api/characterService';
import type { Character } from '../types/character';

export function CharacterList() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/' });
  const page = search.page || 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="character-list">
  
      <div className="table-info">
        <p>Showing {data?.results.length} characters (Total: {data?.info.count})</p>
      </div>

      <div className="modern-table-container">
        <table className="modern-table">
          <thead className="modern-table-head">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Species</th>
              <th>Type</th>
              <th>Gender</th>
              <th>Origin</th>
              <th>Episodes</th>
            </tr>
          </thead>
          <tbody className="modern-table-body">
            {data?.results.map((character: Character) => (
              <tr key={character.id}>
                <td className="id-cell">{character.id}</td>
                <td>
                  <button
                    className="character-name-btn"
                    onClick={() => navigate({ to: '/character/$characterId', params: { characterId: character.id.toString() } })}
                  >
                    {character.name}
                  </button>
                </td>
                <td>
                  <span 
                    className={`status-tag status-${character.status.toLowerCase()}`}
                  >
                    {character.status}
                  </span>
                </td>
                <td>{character.species}</td>
                <td>{character.type || '-'}</td>
                <td>{character.gender}</td>
                <td>{character.origin.name}</td>
                <td>
                  <span className="episode-count">
                    {character.episode.length} episodes
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="pagination">
          <button
            onClick={() => navigate({ to: '/', search: { page: page - 1 } })}
            disabled={!data.info.prev}
            className="pagination-btn"
          >
            Previous
          </button>
          <span>Page {page} of {data.info.pages}</span>
          <button
            onClick={() => navigate({ to: '/', search: { page: page + 1 } })}
            disabled={!data.info.next}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}