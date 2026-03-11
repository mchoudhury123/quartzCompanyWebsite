import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useQuotes from '../hooks/useQuotes';
import MaterialSelector from '../components/quote-builder/MaterialSelector';
import PieceEditor from '../components/quote-builder/PieceEditor';
import ProductPicker from '../components/quote-builder/ProductPicker';
import ReceiptPanel from '../components/quote-builder/ReceiptPanel';
import { FiArrowLeft } from 'react-icons/fi';
import './QuoteBuilderPage.css';

let pieceCounter = 0;

function calcPieceTotal(piece, material, thickness) {
  if (!material) return 0;
  const priceKey = thickness === '30mm' ? 'price_30mm' : 'price_20mm';
  const pricePerSqm = Number(material[priceKey]) || 0;
  const areaSqm = ((piece.x_mm || 0) * (piece.y_mm || 0)) / 1_000_000;
  return areaSqm * pricePerSqm;
}

export default function QuoteBuilderPage() {
  const { id: leadId } = useParams();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { createQuote } = useQuotes(leadId);

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [thickness, setThickness] = useState('20mm');
  const [pieces, setPieces] = useState([]);
  const [activePieceType, setActivePieceType] = useState('worktop');
  const [accessories, setAccessories] = useState([]);
  const [depositAmount, setDepositAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  // --- Piece handlers ---
  const handleAddPiece = useCallback((pieceType) => {
    pieceCounter += 1;
    setPieces((prev) => [
      ...prev,
      {
        id: `piece-${pieceCounter}`,
        piece_type: pieceType,
        description: '',
        x_mm: 0,
        y_mm: 0,
        edge_type: 'none',
        edge_mm: 0,
      },
    ]);
  }, []);

  const handleUpdatePiece = useCallback((pieceId, field, value) => {
    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, [field]: value } : p))
    );
  }, []);

  const handleRemovePiece = useCallback((pieceId) => {
    setPieces((prev) => prev.filter((p) => p.id !== pieceId));
  }, []);

  // --- Accessory handlers (from ProductPicker) ---
  const handleAddAccessory = useCallback((product) => {
    const priceKey = thickness === '30mm' ? 'price_30mm' : 'price_20mm';
    setAccessories((prev) => {
      const existing = prev.findIndex((a) => a.product_id === product.id);
      if (existing >= 0) {
        const updated = [...prev];
        const item = { ...updated[existing] };
        item.quantity += 1;
        item.line_total = item.quantity * item.unit_price;
        updated[existing] = item;
        return updated;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          quantity: 1,
          unit_price: Number(product[priceKey]),
          unit: product.unit,
          line_total: Number(product[priceKey]),
        },
      ];
    });
  }, [thickness]);

  // --- Compute all line items for receipt ---
  const allItems = useMemo(() => {
    const pieceItems = pieces
      .filter((p) => p.x_mm > 0 && p.y_mm > 0)
      .map((p) => {
        const total = calcPieceTotal(p, selectedMaterial, thickness);
        return {
          category: 'stones',
          product_name: `${selectedMaterial?.name || 'Material'} — ${p.piece_type} ${p.description}`.trim(),
          line_total: total,
          piece_type: p.piece_type,
        };
      });

    const accItems = accessories.map((a) => ({
      category: a.category,
      product_name: a.product_name,
      line_total: a.line_total,
    }));

    return [...pieceItems, ...accItems];
  }, [pieces, accessories, selectedMaterial, thickness]);

  // --- Save ---
  const handleSave = async (status = 'draft') => {
    if (saving) return;
    setSaving(true);

    const materialsTotal = allItems
      .filter((i) => i.category === 'stones')
      .reduce((s, i) => s + i.line_total, 0);
    const processesTotal = allItems
      .filter((i) => i.category === 'processes')
      .reduce((s, i) => s + i.line_total, 0);
    const productsTotal = allItems
      .filter((i) => i.category !== 'stones' && i.category !== 'processes')
      .reduce((s, i) => s + i.line_total, 0);
    const subtotal = materialsTotal + processesTotal + productsTotal;
    const vat = subtotal * 0.2;
    const total = subtotal + vat;

    const storedItems = [
      ...pieces.map((p) => ({
        type: 'piece',
        piece_type: p.piece_type,
        description: p.description,
        x_mm: p.x_mm,
        y_mm: p.y_mm,
        edge_type: p.edge_type,
        edge_mm: p.edge_mm,
        line_total: calcPieceTotal(p, selectedMaterial, thickness),
      })),
      ...accessories.map((a) => ({
        type: 'accessory',
        product_id: a.product_id,
        product_name: a.product_name,
        category: a.category,
        quantity: a.quantity,
        unit_price: a.unit_price,
        line_total: a.line_total,
      })),
    ];

    const pieceCount = pieces.length;
    const { error } = await createQuote({
      title: `${selectedMaterial?.name || 'Quote'} — ${pieceCount} piece${pieceCount !== 1 ? 's' : ''}`,
      description: `${thickness} · ${pieces.map((p) => p.piece_type).join(', ')}`,
      items: storedItems,
      subtotal,
      vat,
      total,
      validUntil: null,
      depositAmount,
      selectedThickness: thickness,
    });

    setSaving(false);
    if (!error) {
      navigate(`/admin/leads/${leadId}?tab=quotes`);
    }
  };

  if (productsLoading) {
    return <div className="admin-page-loading">Loading products...</div>;
  }

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const accessoryProducts = products.filter((p) => p.category !== 'stones');

  return (
    <div className="quote-builder">
      <div className="quote-builder__topbar">
        <button
          className="quote-builder__back"
          onClick={() => navigate(`/admin/leads/${leadId}?tab=quotes`)}
        >
          <FiArrowLeft /> Back to Client
        </button>
        <div className="quote-builder__topbar-right">
          <span className="quote-builder__date">{today}</span>
        </div>
      </div>

      <div className="quote-builder__layout">
        <div className="quote-builder__left">
          {/* Step 1: Select material + thickness */}
          <MaterialSelector
            products={products}
            selectedMaterial={selectedMaterial}
            thickness={thickness}
            onSelectMaterial={setSelectedMaterial}
            onThicknessChange={setThickness}
          />

          {/* Step 2: Add pieces with dimensions */}
          {selectedMaterial && (
            <PieceEditor
              activePieceType={activePieceType}
              onPieceTypeChange={setActivePieceType}
              pieces={pieces}
              onAddPiece={handleAddPiece}
              onUpdatePiece={handleUpdatePiece}
              onRemovePiece={handleRemovePiece}
              materialName={selectedMaterial.name}
              thickness={thickness}
            />
          )}

          {/* Step 3: Products & Accessories */}
          {selectedMaterial && (
            <ProductPicker
              products={accessoryProducts}
              thickness={thickness}
              onAddItem={handleAddAccessory}
            />
          )}
        </div>

        <div className="quote-builder__right">
          <ReceiptPanel
            items={allItems}
            depositAmount={depositAmount}
            onDepositChange={setDepositAmount}
            onSave={() => handleSave('draft')}
            onSend={() => handleSave('sent')}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}
