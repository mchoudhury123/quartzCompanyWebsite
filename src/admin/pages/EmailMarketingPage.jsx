import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import useEmailGroups from '../hooks/useEmailGroups';
import StatusBadge from '../components/StatusBadge';
import {
  SALE_TEMPLATES, ACCENT_PRESETS, DEFAULT_SALE_FIELDS, buildSaleEmail, buildBrandedEmail,
} from '../utils/saleEmailTemplates';
import {
  FiSearch, FiSend, FiUsers, FiSave, FiTrash2, FiMail, FiCheckCircle, FiAlertCircle,
} from 'react-icons/fi';
import './EmailMarketingPage.css';

export default function EmailMarketingPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [activeGroupId, setActiveGroupId] = useState(null);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(null); // { active, sent, failed, total, done }

  // Compose mode + sale-template state
  const [mode, setMode] = useState('custom'); // 'custom' | 'sale'
  const [templateId, setTemplateId] = useState('bold');
  const [saleFields, setSaleFields] = useState({ ...DEFAULT_SALE_FIELDS });
  const [saleSubject, setSaleSubject] = useState('');
  const setSaleField = (key, value) => setSaleFields((prev) => ({ ...prev, [key]: value }));
  const setBreakdownItem = (i, key, value) => setSaleFields((prev) => ({
    ...prev,
    breakdown: (prev.breakdown || []).map((it, idx) => (idx === i ? { ...it, [key]: value } : it)),
  }));

  const { groups, saveGroup, updateGroup, deleteGroup } = useEmailGroups();

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      const { data } = await supabase
        .from('leads')
        .select('id, full_name, email, source, status, unsubscribed')
        .order('full_name', { ascending: true });
      setClients(data || []);
      setLoading(false);
    }
    fetchClients();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
    );
  }, [clients, search]);

  // Only email people with an address who haven't unsubscribed.
  const withEmail = (c) => !!(c.email && c.email.includes('@')) && !c.unsubscribed;
  const selectableFiltered = filtered.filter(withEmail);
  const allFilteredSelected =
    selectableFiltered.length > 0 && selectableFiltered.every((c) => selectedIds.has(c.id));

  const selectedClients = clients.filter((c) => selectedIds.has(c.id) && withEmail(c));

  const toggle = (id) => {
    setActiveGroupId(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setActiveGroupId(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        selectableFiltered.forEach((c) => next.delete(c.id));
      } else {
        selectableFiltered.forEach((c) => next.add(c.id));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setActiveGroupId(null);
  };

  const loadGroup = (group) => {
    // Only keep ids that still exist as clients.
    const ids = new Set((group.lead_ids || []).filter((id) => clients.some((c) => c.id === id)));
    setSelectedIds(ids);
    setActiveGroupId(group.id);
  };

  const handleSaveGroup = async () => {
    if (!selectedIds.size) return;
    const name = window.prompt('Name this group (e.g. "Trade customers", "London area"):');
    if (!name || !name.trim()) return;
    const { error } = await saveGroup(name.trim(), [...selectedIds]);
    if (error) window.alert(`Couldn't save the group: ${error.message}`);
  };

  const handleUpdateGroup = async () => {
    if (!activeGroupId) return;
    const { error } = await updateGroup(activeGroupId, [...selectedIds]);
    if (error) window.alert(`Couldn't update the group: ${error.message}`);
    else window.alert('Group updated.');
  };

  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`Delete the group "${group.name}"? (Your clients are not affected.)`)) return;
    await deleteGroup(group.id);
    if (activeGroupId === group.id) setActiveGroupId(null);
  };

  const isSale = mode === 'sale';
  const saleSubjectFinal = saleSubject.trim() || `${saleFields.saleName} — ${saleFields.discount}`;
  const saleHtml = useMemo(
    () => (isSale ? buildSaleEmail(templateId, saleFields) : ''),
    [isSale, templateId, saleFields]
  );
  const brandedHtml = useMemo(
    () => (isSale ? '' : buildBrandedEmail({ subject, body })),
    [isSale, subject, body]
  );

  const canSend = selectedClients.length > 0 && !sending?.active && (
    isSale ? saleFields.saleName.trim() : (subject.trim() && body.trim())
  );

  const handleSend = async () => {
    if (!canSend) return;
    if (!window.confirm(
      `Send this email to ${selectedClients.length} client${selectedClients.length === 1 ? '' : 's'}?`
    )) return;

    const emailSubject = isSale ? saleSubjectFinal : subject.trim();

    let sent = 0, failed = 0;
    setSending({ active: true, sent: 0, failed: 0, total: selectedClients.length });

    for (const c of selectedClients) {
      try {
        // Build per-recipient so the unsubscribe link targets their address.
        const html = isSale
          ? buildSaleEmail(templateId, saleFields, c.email)
          : buildBrandedEmail({ subject: subject.trim(), body, unsubscribeEmail: c.email });
        const res = await fetch('/api/zoho-send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: c.email, subject: emailSubject, html }),
        });
        const data = await res.json();
        if (data.error) failed++; else sent++;
      } catch (_) {
        failed++;
      }
      setSending({ active: true, sent, failed, total: selectedClients.length });
    }

    setSending({ active: false, sent, failed, total: selectedClients.length, done: true });
  };

  return (
    <div className="email-marketing">
      <div className="email-marketing__head">
        <h1 className="email-marketing__title">Email Marketing</h1>
        <p className="email-marketing__sub">Send a message to a group of clients — sales news, delivery updates and more.</p>
      </div>

      <div className="email-marketing__layout">
        {/* ── Recipients ── */}
        <div className="email-marketing__panel email-marketing__recipients">
          <div className="email-marketing__panel-head">
            <h2 className="email-marketing__panel-title"><FiUsers /> Recipients</h2>
            <span className="email-marketing__count">{selectedIds.size} selected</span>
          </div>

          {groups.length > 0 && (
            <div className="email-marketing__groups">
              <span className="email-marketing__groups-label">Saved groups:</span>
              {groups.map((g) => (
                <span key={g.id} className={`email-marketing__group-chip${activeGroupId === g.id ? ' is-active' : ''}`}>
                  <button className="email-marketing__group-load" onClick={() => loadGroup(g)}>
                    {g.name} ({(g.lead_ids || []).length})
                  </button>
                  <button className="email-marketing__group-del" onClick={() => handleDeleteGroup(g)} title="Delete group">
                    <FiTrash2 />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="email-marketing__search">
            <FiSearch className="email-marketing__search-icon" />
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="email-marketing__toolbar">
            <label className="email-marketing__selectall">
              <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} />
              Select all{search ? ' (matching)' : ''}
            </label>
            <div className="email-marketing__toolbar-actions">
              <button className="email-marketing__ghost-btn" onClick={handleSaveGroup} disabled={!selectedIds.size}>
                <FiSave /> Save as group
              </button>
              {activeGroupId && (
                <button className="email-marketing__ghost-btn" onClick={handleUpdateGroup}>
                  Update group
                </button>
              )}
              <button className="email-marketing__ghost-btn" onClick={clearSelection} disabled={!selectedIds.size}>
                Clear
              </button>
            </div>
          </div>

          <div className="email-marketing__list">
            {loading ? (
              <p className="email-marketing__empty">Loading clients…</p>
            ) : filtered.length === 0 ? (
              <p className="email-marketing__empty">No clients found.</p>
            ) : (
              filtered.map((c) => {
                const emailable = withEmail(c);
                return (
                  <label key={c.id} className={`email-marketing__row${!emailable ? ' is-disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggle(c.id)}
                      disabled={!emailable}
                    />
                    <span className="email-marketing__row-name">
                      <span className="email-marketing__row-nametext">{c.full_name || 'Unnamed'}</span>
                      <StatusBadge status={c.status} />
                    </span>
                    <span className="email-marketing__row-email">
                      {c.unsubscribed
                        ? 'unsubscribed'
                        : (c.email && c.email.includes('@') ? c.email : 'no email on file')}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* ── Compose ── */}
        <div className="email-marketing__panel email-marketing__compose">
          <div className="email-marketing__panel-head">
            <h2 className="email-marketing__panel-title"><FiMail /> Compose</h2>
            <div className="email-marketing__mode">
              <button
                className={`email-marketing__mode-btn${mode === 'custom' ? ' is-active' : ''}`}
                onClick={() => setMode('custom')}
              >
                Custom message
              </button>
              <button
                className={`email-marketing__mode-btn${mode === 'sale' ? ' is-active' : ''}`}
                onClick={() => setMode('sale')}
              >
                Sale template
              </button>
            </div>
          </div>

          {mode === 'custom' ? (
            <>
              <label className="email-marketing__label">Subject</label>
              <input
                className="email-marketing__input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. An update on your delivery"
              />

              <label className="email-marketing__label">Message</label>
              <textarea
                className="email-marketing__textarea"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={'Write your message here.\n\nLeave a blank line between paragraphs. It will be sent in The Quartz Company branded template.'}
              />

              <label className="email-marketing__label">Live preview</label>
              <iframe className="email-marketing__preview" title="Email preview" srcDoc={brandedHtml} />
            </>
          ) : (
            <>
              <label className="email-marketing__label">Template design</label>
              <div className="email-marketing__templates">
                {SALE_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className={`email-marketing__template${templateId === t.id ? ' is-active' : ''}`}
                    onClick={() => setTemplateId(t.id)}
                  >
                    <span className="email-marketing__template-name">{t.name}</span>
                    <span className="email-marketing__template-desc">{t.description}</span>
                  </button>
                ))}
              </div>

              <label className="email-marketing__label">Accent colour</label>
              <div className="email-marketing__swatches">
                {ACCENT_PRESETS.map((a) => (
                  <button
                    key={a.value}
                    className={`email-marketing__swatch${saleFields.accent === a.value ? ' is-active' : ''}`}
                    style={{ background: a.value }}
                    title={a.label}
                    onClick={() => setSaleField('accent', a.value)}
                  />
                ))}
                <input
                  type="color"
                  className="email-marketing__swatch-custom"
                  value={saleFields.accent}
                  onChange={(e) => setSaleField('accent', e.target.value)}
                  title="Custom colour"
                />
              </div>

              <div className="email-marketing__sale-grid">
                <div>
                  <label className="email-marketing__label">Sale name</label>
                  <input className="email-marketing__input" type="text" value={saleFields.saleName}
                    onChange={(e) => setSaleField('saleName', e.target.value)} placeholder="Summer Sale" />
                </div>
                <div>
                  <label className="email-marketing__label">Discount / offer</label>
                  <input className="email-marketing__input" type="text" value={saleFields.discount}
                    onChange={(e) => setSaleField('discount', e.target.value)} placeholder="20% OFF" />
                </div>
                <div>
                  <label className="email-marketing__label">Sale end date</label>
                  <input className="email-marketing__input" type="date" value={saleFields.endDate}
                    onChange={(e) => setSaleField('endDate', e.target.value)} />
                </div>
                <div>
                  <label className="email-marketing__label">Button label</label>
                  <input className="email-marketing__input" type="text" value={saleFields.ctaLabel}
                    onChange={(e) => setSaleField('ctaLabel', e.target.value)} placeholder="Get Your Free Quote" />
                </div>
              </div>

              <label className="email-marketing__label">Headline</label>
              <input className="email-marketing__input" type="text" value={saleFields.headline}
                onChange={(e) => setSaleField('headline', e.target.value)} placeholder="Transform your kitchen for less" />

              <label className="email-marketing__label">Button link (URL)</label>
              <input className="email-marketing__input" type="text" value={saleFields.ctaUrl}
                onChange={(e) => setSaleField('ctaUrl', e.target.value)} placeholder="https://www.thequartzcompany.co.uk/quote" />

              <label className="email-marketing__label">Message</label>
              <textarea className="email-marketing__textarea" rows={5} value={saleFields.message}
                onChange={(e) => setSaleField('message', e.target.value)} />

              <label className="email-marketing__checkbox">
                <input
                  type="checkbox"
                  checked={!!saleFields.showBreakdown}
                  onChange={(e) => setSaleField('showBreakdown', e.target.checked)}
                />
                Show discount breakdown (materials, processing, installation)
              </label>

              {saleFields.showBreakdown && (
                <div className="email-marketing__breakdown">
                  <label className="email-marketing__label">Breakdown heading</label>
                  <input
                    className="email-marketing__input"
                    type="text"
                    value={saleFields.breakdownTitle}
                    onChange={(e) => setSaleField('breakdownTitle', e.target.value)}
                    placeholder="What's included in the sale"
                  />
                  {(saleFields.breakdown || []).map((it, i) => (
                    <div className="email-marketing__breakdown-row" key={i}>
                      <input
                        className="email-marketing__input"
                        type="text"
                        value={it.value}
                        onChange={(e) => setBreakdownItem(i, 'value', e.target.value)}
                        placeholder="40% off"
                        aria-label={`Discount ${i + 1}`}
                      />
                      <input
                        className="email-marketing__input"
                        type="text"
                        value={it.label}
                        onChange={(e) => setBreakdownItem(i, 'label', e.target.value)}
                        placeholder="Materials"
                        aria-label={`Label ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <label className="email-marketing__label">Subject line (optional)</label>
              <input className="email-marketing__input" type="text" value={saleSubject}
                onChange={(e) => setSaleSubject(e.target.value)} placeholder={saleSubjectFinal} />

              <label className="email-marketing__label">Live preview</label>
              <iframe className="email-marketing__preview" title="Email preview" srcDoc={saleHtml} />
            </>
          )}

          <div className="email-marketing__send-row">
            <div className="email-marketing__recap">
              <strong>{selectedClients.length}</strong> recipient{selectedClients.length === 1 ? '' : 's'} with an email
              {selectedIds.size > selectedClients.length && (
                <span className="email-marketing__recap-note"> ({selectedIds.size - selectedClients.length} selected have no email)</span>
              )}
            </div>
            <button className="email-marketing__send-btn" onClick={handleSend} disabled={!canSend}>
              <FiSend /> {sending?.active ? 'Sending…' : 'Send Email'}
            </button>
          </div>

          {sending && (
            <div className={`email-marketing__status${sending.done ? ' is-done' : ''}`}>
              {sending.active ? (
                <>Sending… {sending.sent + sending.failed} / {sending.total}</>
              ) : (
                <>
                  <FiCheckCircle /> Sent {sending.sent} of {sending.total}.
                  {sending.failed > 0 && (
                    <span className="email-marketing__status-fail"> <FiAlertCircle /> {sending.failed} failed.</span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
