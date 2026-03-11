import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useQuotes from '../hooks/useQuotes';
import useQuoteDetail from '../hooks/useQuoteDetail';
import MaterialSelector from '../components/quote-builder/MaterialSelector';
import PieceEditor from '../components/quote-builder/PieceEditor';
import ProductPicker from '../components/quote-builder/ProductPicker';
import ReceiptPanel from '../components/quote-builder/ReceiptPanel';
import QuotePDF from '../components/quote-builder/QuotePDF';
import { FiArrowLeft } from 'react-icons/fi';
import './QuoteBuilderPage.css';

let pieceCounter = 0;

export default function QuoteBuilderPage() {
  const { id: leadId, quoteId } = useParams();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { createQuote, updateQuote } = useQuotes(leadId);
  const { quote: existingQuote, loading: quoteLoading } = useQuoteDetail(quoteId);
  const pdfRef = useRef(null);

  const isEditMode = !!quoteId;

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [thickness, setThickness] = useState('20mm');
  const [pieces, setPieces] = useState([]);
  const [activePieceType, setActivePieceType] = useState('worktop');
  const [accessories, setAccessories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(!isEditMode);

  // Load existing quote data in edit mode
  useEffect(() => {
    if (!isEditMode || !existingQuote || !products.length || initialized) return;

    // Restore thickness
    if (existingQuote.selected_thickness) {
      setThickness(existingQuote.selected_thickness);
    }

    // Restore material
    const materialName = existingQuote.title?.split(' — ')[0];
    if (materialName) {
      const mat = products.find((p) => p.category === 'stones' && p.name === materialName);
      if (mat) setSelectedMaterial(mat);
    }

    // Restore items from stored JSON
    const items = existingQuote.items || [];
    const restoredPieces = [];
    const restoredAccessories = [];

    items.forEach((item) => {
      if (item.type === 'piece') {
        pieceCounter += 1;
        restoredPieces.push({
          id: `piece-${pieceCounter}`,
          piece_type: item.piece_type,
          description: item.description || '',
          x_mm: item.x_mm || 0,
          y_mm: item.y_mm || 0,
          edge_type: item.edge_type || 'none',
          edge_mm: item.edge_mm || 0,
          discount: item.discount || 0,
          comments: item.comments || '',
          features: item.features || [],
        });
      } else if (item.type === 'accessory') {
        restoredAccessories.push({
          product_id: item.product_id,
          product_name: item.product_name,
          category: item.category,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit: item.unit || 'each',
          line_total: item.line_total,
        });
      }
    });

    setPieces(restoredPieces);
    setAccessories(restoredAccessories);
    setInitialized(true);
  }, [isEditMode, existingQuote, products, initialized]);

  const pricePerSqm = selectedMaterial
    ? Number(selectedMaterial[thickness === '30mm' ? 'price_30mm' : 'price_20mm']) || 0
    : 0;

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
        discount: 0,
        comments: '',
        features: [],
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

  // --- Accessory handlers ---
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
    const pieceItems = pieces.map((p) => {
      const areaSqm = ((p.x_mm || 0) * (p.y_mm || 0)) / 1_000_000;
      const materialCost = areaSqm * pricePerSqm;
      const featuresTotal = (p.features || []).reduce((s, f) => s + (f.price || 0), 0);
      const fullPrice = materialCost + featuresTotal;
      const discount = p.discount || 0;
      const sale = Math.max(0, fullPrice - discount);

      return {
        category: 'stones',
        product_name: `${selectedMaterial?.name || 'Material'} — ${p.piece_type} ${p.description}`.trim(),
        original_price: fullPrice,
        discount,
        line_total: sale,
        features_total: featuresTotal,
        piece_type: p.piece_type,
      };
    });

    const accItems = accessories.map((a) => ({
      category: a.category,
      product_name: a.product_name,
      original_price: a.line_total,
      discount: 0,
      line_total: a.line_total,
    }));

    return [...pieceItems, ...accItems];
  }, [pieces, accessories, selectedMaterial, pricePerSqm]);

  // --- Build quote payload ---
  const buildPayload = (status, validUntil = null) => {
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
    const depositAmount = total * 0.2;

    const storedItems = [
      ...pieces.map((p) => {
        const areaSqm = ((p.x_mm || 0) * (p.y_mm || 0)) / 1_000_000;
        const materialCost = areaSqm * pricePerSqm;
        const featuresTotal = (p.features || []).reduce((s, f) => s + (f.price || 0), 0);
        return {
          type: 'piece',
          piece_type: p.piece_type,
          description: p.description,
          x_mm: p.x_mm,
          y_mm: p.y_mm,
          edge_type: p.edge_type,
          edge_mm: p.edge_mm,
          discount: p.discount || 0,
          comments: p.comments || '',
          features: p.features || [],
          material_cost: materialCost,
          features_total: featuresTotal,
          line_total: Math.max(0, materialCost + featuresTotal - (p.discount || 0)),
        };
      }),
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
    return {
      title: `${selectedMaterial?.name || 'Quote'} — ${pieceCount} piece${pieceCount !== 1 ? 's' : ''}`,
      description: `${thickness} · ${pieces.map((p) => p.piece_type).join(', ')}`,
      items: storedItems,
      subtotal,
      vat,
      total,
      status,
      valid_until: validUntil,
      deposit_amount: depositAmount,
      selected_thickness: thickness,
    };
  };

  // --- Save or update ---
  const saveQuote = async (status, validUntil = null) => {
    const payload = buildPayload(status, validUntil);

    if (isEditMode && quoteId) {
      return updateQuote(quoteId, payload);
    } else {
      return createQuote({
        title: payload.title,
        description: payload.description,
        items: payload.items,
        subtotal: payload.subtotal,
        vat: payload.vat,
        total: payload.total,
        validUntil: payload.valid_until,
        depositAmount: payload.deposit_amount,
        selectedThickness: payload.selected_thickness,
      });
    }
  };

  // --- Save Draft ---
  const handleSaveDraft = async () => {
    if (saving) return;
    setSaving(true);
    const { error } = await saveQuote('draft');
    setSaving(false);
    if (!error) {
      navigate(`/admin/leads/${leadId}?tab=quotes`);
    }
  };

  // --- Download PDF ---
  const handleDownloadPDF = async () => {
    if (saving) return;
    setSaving(true);
    const { data, error } = await saveQuote('sent');
    setSaving(false);
    if (!error && pdfRef.current) {
      pdfRef.current.generate(data);
    }
  };

  // --- Send Email ---
  const handleSendEmail = async () => {
    if (saving) return;
    setSaving(true);

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 2);
    const validUntilStr = validUntil.toISOString().split('T')[0];

    const { data, error } = await saveQuote('sent', validUntilStr);
    if (error) {
      setSaving(false);
      return;
    }

    try {
      const payload = buildPayload('sent', validUntilStr);
      const res = await fetch('/api/zoho-send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: data?.id || quoteId,
          quoteNumber: data?.quote_number || existingQuote?.quote_number || '',
          total: payload.total,
          deposit: payload.deposit_amount,
          validUntil: validUntilStr,
          leadId,
        }),
      });
      const result = await res.json();
      if (result.error) {
        alert(`Email sending failed: ${result.error}`);
      }
    } catch (err) {
      alert(`Email sending failed: ${err.message}`);
    }

    setSaving(false);
    navigate(`/admin/leads/${leadId}?tab=quotes`);
  };

  if (productsLoading || (isEditMode && quoteLoading)) {
    return <div className="admin-page-loading">Loading...</div>;
  }

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const accessoryProducts = products.filter((p) => p.category !== 'stones');

  // Build PDF data
  const pdfData = {
    quoteNumber: existingQuote?.quote_number || 'Draft',
    date: today,
    materialName: selectedMaterial?.name || '',
    thickness,
    items: allItems,
    allItems,
  };

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
          {isEditMode && existingQuote?.quote_number && (
            <span className="quote-builder__qnum">{existingQuote.quote_number}</span>
          )}
          <span className="quote-builder__date">{today}</span>
        </div>
      </div>

      <div className="quote-builder__layout">
        <div className="quote-builder__left">
          <MaterialSelector
            products={products}
            selectedMaterial={selectedMaterial}
            thickness={thickness}
            onSelectMaterial={setSelectedMaterial}
            onThicknessChange={setThickness}
          />

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
              pricePerSqm={pricePerSqm}
            />
          )}

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
            onSaveDraft={handleSaveDraft}
            onDownloadPDF={handleDownloadPDF}
            onSendEmail={handleSendEmail}
            saving={saving}
          />
        </div>
      </div>

      {/* Hidden PDF render target */}
      <QuotePDF ref={pdfRef} data={pdfData} />
    </div>
  );
}
