import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
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

  const columnHelper = createColumnHelper<Character>();

  // Define table columns with proper typing
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <div className="id-cell">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <button
          className="character-name-btn"
          onClick={() => navigate({ 
            to: '/character/$characterId', 
            params: { characterId: info.row.original.id.toString() } 
          })}
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`status-tag status-${info.getValue().toLowerCase()}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('species', {
      header: 'Species',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
    }),
    columnHelper.accessor('origin.name', {
      header: 'Origin',
    }),
    columnHelper.accessor('episode', {
      header: 'Episodes',
      cell: (info) => (
        <span className="episode-count">
          {info.getValue().length} episodes
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="modern-table-body">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
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