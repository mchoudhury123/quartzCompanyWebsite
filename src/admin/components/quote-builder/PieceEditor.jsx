import { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiChevronUp } from 'react-icons/fi';
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

const FEATURES = [
  { value: 'undermount_sink', label: 'Undermount Sink Cutout', price: 85 },
  { value: 'belfast_sink', label: 'Belfast Sink Cutout', price: 95 },
  { value: 'hob_cutout', label: 'Hob Cutout', price: 85 },
  { value: 'tap_hole', label: 'Tap Hole', price: 25 },
  { value: 'electric_socket', label: 'Electric Socket Cutout', price: 45 },
  { value: 'pop_up_socket', label: 'Pop-up Socket Cutout', price: 55 },
  { value: 'drainer_grooves', label: 'Drainer Grooves', price: 65 },
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
  pricePerSqm,
  originalPricePerSqm,
  discountPercent = 0,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [featureSelect, setFeatureSelect] = useState('');

  const filtered = pieces.filter((p) => p.piece_type === activePieceType);
  const label = PIECE_TYPES.find((t) => t.key === activePieceType)?.label || activePieceType;

  const effectiveOriginal = originalPricePerSqm || pricePerSqm || 0;

  const calcOriginalMaterial = (piece) => {
    const areaSqm = ((piece.x_mm || 0) * (piece.y_mm || 0)) / 1_000_000;
    return areaSqm * effectiveOriginal;
  };

  const calcSaleMaterial = (piece) => {
    const areaSqm = ((piece.x_mm || 0) * (piece.y_mm || 0)) / 1_000_000;
    return areaSqm * (pricePerSqm || 0);
  };

  const calcFeaturesTotal = (piece) => {
    if (!piece.features || piece.features.length === 0) return 0;
    return piece.features.reduce((sum, f) => sum + (f.price || 0), 0);
  };

  const handleAddFeature = (pieceId) => {
    if (!featureSelect) return;
    const feat = FEATURES.find((f) => f.value === featureSelect);
    if (!feat) return;
    const piece = pieces.find((p) => p.id === pieceId);
    const existing = piece?.features || [];
    if (existing.some((f) => f.value === feat.value)) return;
    onUpdatePiece(pieceId, 'features', [...existing, { ...feat }]);
    setFeatureSelect('');
  };

  const handleRemoveFeature = (pieceId, featureValue) => {
    const piece = pieces.find((p) => p.id === pieceId);
    const updated = (piece?.features || []).filter((f) => f.value !== featureValue);
    onUpdatePiece(pieceId, 'features', updated);
  };

  const fmt = (n) => `£${Number(n).toFixed(2)}`;

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

      {/* Grid header */}
      <div className="piece-editor__grid-header">
        <span></span>
        <span>{materialName}</span>
        <span></span>
        <span>X mm</span>
        <span>Y mm</span>
        <span>Edge</span>
        <span>Edge mm</span>
        <span>Price</span>
        <span>{discountPercent > 0 ? `Discount (${discountPercent}%)` : 'Discount'}</span>
        <span>Sale</span>
        <span></span>
      </div>

      {/* Piece rows */}
      <div className="piece-editor__rows">
        {filtered.map((piece, i) => {
          const originalMaterial = calcOriginalMaterial(piece);
          const saleMaterial = calcSaleMaterial(piece);
          const featuresTotal = calcFeaturesTotal(piece);
          const price = originalMaterial + featuresTotal;
          const sale = saleMaterial + featuresTotal;
          const discount = Math.max(0, price - sale);
          const isExpanded = expandedId === piece.id;

          return (
            <div key={piece.id} className="piece-editor__piece">
              {/* Main row */}
              <div className="piece-editor__grid-row">
                <button
                  className={`piece-editor__edit-btn ${isExpanded ? 'active' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : piece.id)}
                  title="Edit details"
                >
                  {isExpanded ? <FiChevronUp /> : <FiEdit2 />}
                </button>
                <span className="piece-editor__row-label">({i + 1}) {label}</span>
                <input
                  type="text"
                  placeholder="Desc"
                  value={piece.description}
                  onChange={(e) => onUpdatePiece(piece.id, 'description', e.target.value)}
                  className="piece-editor__input"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={piece.x_mm || ''}
                  onChange={(e) => onUpdatePiece(piece.id, 'x_mm', parseFloat(e.target.value) || 0)}
                  className="piece-editor__input piece-editor__input--center"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={piece.y_mm || ''}
                  onChange={(e) => onUpdatePiece(piece.id, 'y_mm', parseFloat(e.target.value) || 0)}
                  className="piece-editor__input piece-editor__input--center"
                />
                <select
                  value={piece.edge_type}
                  onChange={(e) => onUpdatePiece(piece.id, 'edge_type', e.target.value)}
                  className="piece-editor__input"
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
                  className="piece-editor__input piece-editor__input--center"
                />
                <span className="piece-editor__price">{fmt(price)}</span>
                <span className="piece-editor__discount">{fmt(discount)}</span>
                <span className="piece-editor__sale">{fmt(sale)}</span>
                <button
                  className="piece-editor__remove"
                  onClick={() => onRemovePiece(piece.id)}
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* Expanded detail row */}
              {isExpanded && (
                <div className="piece-editor__detail">
                  <div className="piece-editor__detail-row">
                    <label className="piece-editor__detail-label">Comments</label>
                    <input
                      type="text"
                      placeholder="Notes about this piece..."
                      value={piece.comments || ''}
                      onChange={(e) => onUpdatePiece(piece.id, 'comments', e.target.value)}
                      className="piece-editor__detail-input"
                    />
                  </div>
                  <div className="piece-editor__detail-row">
                    <label className="piece-editor__detail-label">Add Feature</label>
                    <div className="piece-editor__feature-add">
                      <select
                        value={featureSelect}
                        onChange={(e) => setFeatureSelect(e.target.value)}
                        className="piece-editor__detail-select"
                      >
                        <option value="">Select feature...</option>
                        {FEATURES.filter(
                          (f) => !(piece.features || []).some((pf) => pf.value === f.value)
                        ).map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label} — {fmt(f.price)}
                          </option>
                        ))}
                      </select>
                      <button
                        className="piece-editor__feature-add-btn"
                        onClick={() => handleAddFeature(piece.id)}
                        disabled={!featureSelect}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  {/* Feature list */}
                  {(piece.features || []).length > 0 && (
                    <div className="piece-editor__features">
                      {(piece.features || []).map((f) => (
                        <div key={f.value} className="piece-editor__feature-item">
                          <span className="piece-editor__feature-name">{f.label}</span>
                          <span className="piece-editor__feature-price">{fmt(f.price)}</span>
                          <button
                            className="piece-editor__feature-remove"
                            onClick={() => handleRemoveFeature(piece.id, f.value)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add piece button */}
      <button className="piece-editor__add" onClick={() => onAddPiece(activePieceType)}>
        <FiPlus /> Add {label}
      </button>
    </div>
  );
}
