import { FiPlus, FiTrash2 } from 'react-icons/fi';
import './PieceEditor.css';

const PIECE_TYPES = [
  { key: 'worktop', label: 'Worktop' },
  { key: 'upstand', label: 'Upstand' },
  { key: 'splashback', label: 'Splashback' },
  { key: 'cladding', label: 'Cladding' },
  { key: 'cill', label: 'Cill' },
];

const EDGE_TYPES = [
  { value: 'none', label: 'No Edge' },
  { value: 'pencil_round', label: 'Pencil Round' },
  { value: 'double_bevel', label: 'Double Bevel' },
  { value: 'bullnose', label: 'Bullnose' },
  { value: 'chamfer', label: 'Chamfer' },
  { value: 'ogee', label: 'Ogee' },
];

export default function PieceEditor({
  activePieceType,
  onPieceTypeChange,
  pieces,
  onAddPiece,
  onUpdatePiece,
  onRemovePiece,
  materialName,
  thickness,
}) {
  const filtered = pieces.filter((p) => p.piece_type === activePieceType);
  const label = PIECE_TYPES.find((t) => t.key === activePieceType)?.label || activePieceType;

  return (
    <div className="piece-editor">
      {/* Category tabs */}
      <div className="piece-editor__tabs">
        {PIECE_TYPES.map((t) => {
          const count = pieces.filter((p) => p.piece_type === t.key).length;
          return (
            <button
              key={t.key}
              className={`piece-editor__tab ${activePieceType === t.key ? 'active' : ''}`}
              onClick={() => onPieceTypeChange(t.key)}
            >
              {t.label}
              {count > 0 && <span className="piece-editor__tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Material + thickness header */}
      {materialName && (
        <div className="piece-editor__header">
          <span className="piece-editor__header-mat">{materialName}</span>
          <span className="piece-editor__header-sep">·</span>
          <span className="piece-editor__header-dim">X mm</span>
          <span className="piece-editor__header-dim">Y mm</span>
          <span className="piece-editor__header-dim piece-editor__header-dim--wide">Edge</span>
          <span className="piece-editor__header-dim">Edge mm</span>
        </div>
      )}

      {/* Piece rows */}
      <div className="piece-editor__rows">
        {filtered.map((piece, i) => (
          <div key={piece.id} className="piece-editor__row">
            <span className="piece-editor__row-num">({i + 1}) {label}</span>
            <input
              type="text"
              placeholder="Desc"
              value={piece.description}
              onChange={(e) => onUpdatePiece(piece.id, 'description', e.target.value)}
              className="piece-editor__input piece-editor__input--desc"
            />
            <input
              type="number"
              min="0"
              placeholder="0"
              value={piece.x_mm || ''}
              onChange={(e) => onUpdatePiece(piece.id, 'x_mm', parseFloat(e.target.value) || 0)}
              className="piece-editor__input piece-editor__input--dim"
            />
            <input
              type="number"
              min="0"
              placeholder="0"
              value={piece.y_mm || ''}
              onChange={(e) => onUpdatePiece(piece.id, 'y_mm', parseFloat(e.target.value) || 0)}
              className="piece-editor__input piece-editor__input--dim"
            />
            <select
              value={piece.edge_type}
              onChange={(e) => onUpdatePiece(piece.id, 'edge_type', e.target.value)}
              className="piece-editor__input piece-editor__input--edge"
            >
              {EDGE_TYPES.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={piece.edge_mm || ''}
              onChange={(e) => onUpdatePiece(piece.id, 'edge_mm', parseFloat(e.target.value) || 0)}
              className="piece-editor__input piece-editor__input--dim"
            />
            <button
              className="piece-editor__remove"
              onClick={() => onRemovePiece(piece.id)}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Add piece button */}
      <button className="piece-editor__add" onClick={() => onAddPiece(activePieceType)}>
        <FiPlus /> Add {label}
      </button>
    </div>
  );
}
