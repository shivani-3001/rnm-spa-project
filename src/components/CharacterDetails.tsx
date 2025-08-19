import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { fetchCharacter } from '../api/characterService';

export function CharacterDetails() {
  const { characterId } = useParams({ from: '/character/$characterId' });
  const navigate = useNavigate();

  const { data: character, isLoading, error } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => fetchCharacter(parseInt(characterId)),
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!character) return <div className="error">Character not found</div>;

  return (
    <div className="character-details">
      <div className="character-header">
        <button onClick={() => navigate({ to: '/', search: { page: 1 } })} className="back-btn">← Back</button>
        <h2>{character.name}</h2>
      </div>

      <div className="character-content">
        <img src={character.image} alt={character.name} />

        <div className="character-info">
          <div className="info-section">
            <h3>Basic Info</h3>
            <p><strong>Status:</strong> <span className={`status-tag status-${character.status.toLowerCase()}`}>{character.status}</span></p>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Type:</strong> {character.type || 'Unknown'}</p>
            <p><strong>Gender:</strong> {character.gender}</p>
          </div>

          <div className="info-section">
            <h3>Location</h3>
            <p><strong>Origin:</strong> {character.origin.name}</p>
            <p><strong>Current Location:</strong> {character.location.name}</p>
            {character.origin.url && (
              <p><strong>Origin URL:</strong> <a href={character.origin.url} target="_blank" rel="noopener noreferrer" className="api-link">View Location</a></p>
            )}
            {character.location.url && (
              <p><strong>Location URL:</strong> <a href={character.location.url} target="_blank" rel="noopener noreferrer" className="api-link">View Location</a></p>
            )}
          </div>

          <div className="info-section">
            <h3>Episodes</h3>
            <p>Appears in <strong>{character.episode.length}</strong> episodes</p>
            <div className="episode-preview">
              {character.episode.slice(0, 5).map((episode, index) => (
                <span key={index} className="episode-tag">
                  Episode {episode.split('/').pop()}
                </span>
              ))}
              {character.episode.length > 5 && (
                <span className="episode-tag">+{character.episode.length - 5} more</span>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Created</h3>
            <p>{new Date(character.created).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Character ID:</strong> {character.id}</p>
            <p><strong>API URL:</strong> <a href={character.url} target="_blank" rel="noopener noreferrer" className="api-link">View API Data</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}