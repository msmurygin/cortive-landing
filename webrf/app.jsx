/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback } = React;

// ============================================================
// BRAND THEMES — Quark indigo (night) + teal (day)
// ============================================================
const THEMES = {
  day: {
    bg: '#eef3f2',
    surface: '#ffffff',
    surfaceAlt: '#e2ebe9',
    border: '#c7d5d2',
    borderStrong: '#5a7570',
    text: '#0a1f1c',
    textMuted: '#5a7570',
    accent: '#00cbaa',
    accentText: '#00201b',
    focus: '#00cbaa',
    ok: '#00a888',
    warn: '#c47a00',
    err: '#d93838',
    chipBg: '#e2ebe9',
    scanBg: '#d8f5ef',
    offlineBg: '#fce9d8',
    shadow: '0 1px 0 rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)',
  },
  night: {
    bg: '#0f1028',
    surface: '#181b3a',
    surfaceAlt: '#20234a',
    border: '#2d3360',
    borderStrong: '#4b5290',
    text: '#e8eaff',
    textMuted: '#8a90c0',
    accent: '#9b9de6',
    accentText: '#0f1028',
    focus: '#9b9de6',
    ok: '#7bd8a8',
    warn: '#ffb347',
    err: '#ff6b6b',
    chipBg: '#20234a',
    scanBg: '#272a5e',
    offlineBg: '#3a2a1a',
    shadow: '0 0 0 1px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
  },
};

// ============================================================
// DATA
// ============================================================
const MENU_ROOT = [
  { id: 'inbound', label: 'Inbound', ru: 'Приёмка', icon: '↓' },
  { id: 'outbound', label: 'Outbound', ru: 'Отгрузка', icon: '↑' },
  { id: 'inventory', label: 'Inventory', ru: 'Остатки', icon: '◫' },
  { id: 'cyclecount', label: 'Cycle count', ru: 'Инвентаризация', icon: '⟳' },
  { id: 'putaway', label: 'Put-away', ru: 'Размещение', icon: '⇲' },
  { id: 'picking', label: 'Picking', ru: 'Подбор', icon: '⇱' },
  { id: 'transfer', label: 'Transfer', ru: 'Перемещение', icon: '⇄' },
  { id: 'packing', label: 'Packing', ru: 'Упаковка', icon: '▣' },
  { id: 'labels', label: 'Labels', ru: 'Этикетки', icon: '≡' },
  { id: 'returns', label: 'Returns', ru: 'Возвраты', icon: '↩' },
  { id: 'lookup', label: 'Lookup', ru: 'Поиск', icon: '⌕' },
  { id: 'replenish', label: 'Replenish', ru: 'Пополнение', icon: '⇡' },
  { id: 'loading', label: 'Loading', ru: 'Погрузка', icon: '⤒' },
  { id: 'quality', label: 'Quality', ru: 'Контроль', icon: '✓' },
  { id: 'reports', label: 'Reports', ru: 'Отчёты', icon: '▤' },
  { id: 'settings', label: 'Settings', ru: 'Настройки', icon: '⚙' },
];

const INBOUND_SUB = [
  { id: 'asn', label: 'ASN Receipt', ru: 'По УПД / ASN' },
  { id: 'blind', label: 'Blind Receipt', ru: 'Без документа' },
  { id: 'po', label: 'PO Receipt', ru: 'По заказу поставщику' },
  { id: 'return', label: 'Customer Return', ru: 'Возврат клиента' },
  { id: 'xdock', label: 'Cross-dock', ru: 'Кросс-докинг' },
  { id: 'quarantine', label: 'Quarantine', ru: 'Карантин / брак' },
];

const UOM = ['pcs', 'box', 'pal', 'kg', 'l', 'm'];

// Simulated ASN expectations for warning states
const ASN_EXPECTED = {
  '4607010240158': { qty: 24, uom: 'pcs', name: 'Grease LG-EP2 400g cartridge', bin: 'A-01-02-03' },
  '4607010240165': { qty: 10, uom: 'l', name: 'Hydraulic oil HLP-46 20L', bin: 'A-02-04-01' },
  '4607010240172': { qty: 50, uom: 'pcs', name: 'V-belt SPA 1250 industrial', bin: 'B-01-03-02' },
  '4607010240189': { qty: 100, uom: 'pcs', name: 'Bearing 6205-2RS SKF', bin: 'B-02-01-04' },
  '4607010240196': { qty: 15, uom: 'm', name: 'Chain 12B-1 roller 5m reel', bin: 'C-03-02-01' },
};

const VALID_BINS = ['A-01-02-03', 'A-02-04-01', 'B-01-03-02', 'B-02-01-04', 'C-03-02-01', 'D-01-01-01'];

// ============================================================
// HOOKS
// ============================================================
function useKeyboard(handler, deps) {
  useEffect(() => {
    const fn = (e) => handler(e);
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, deps);
}

// ============================================================
// UI PRIMITIVES
// ============================================================
function KeyCap({ children, theme, wide }) {
  const t = THEMES[theme];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: wide ? 'auto' : 22, padding: wide ? '3px 8px' : '3px 6px',
      borderRadius: 4, fontSize: 12, fontWeight: 700,
      fontFamily: 'JetBrains Mono, monospace',
      background: t.surfaceAlt, color: t.text,
      border: `1px solid ${t.border}`,
      boxShadow: `inset 0 -2px 0 ${t.border}`,
    }}>{children}</span>
  );
}

function Chip({ children, tone, theme }) {
  const t = THEMES[theme];
  const tones = {
    ok: { bg: t.ok, fg: '#fff' },
    warn: { bg: t.warn, fg: '#fff' },
    err: { bg: t.err, fg: '#fff' },
    accent: { bg: t.accent, fg: t.accentText },
    mono: { bg: t.surfaceAlt, fg: t.text },
  };
  const c = tones[tone] || tones.mono;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 3,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
      textTransform: 'uppercase',
      background: c.bg, color: c.fg,
      fontFamily: 'JetBrains Mono, monospace',
    }}>{children}</span>
  );
}

// ============================================================
// STATUS BAR
// ============================================================
function StatusBar({ theme, scale, online }) {
  const t = THEMES[theme];
  const padY = Math.max(8, 8 * scale);
  const padX = Math.max(12, 12 * scale);
  const fs = Math.max(12, 12 * scale);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${padY}px ${padX}px`, background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      fontSize: fs, color: t.textMuted,
      fontFamily: 'JetBrains Mono, monospace', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: t.text, fontWeight: 700 }}>WebRF</span>
        <span>·</span>
        <span>op.ivanov</span>
        <span>·</span>
        <span>WH-01</span>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {!online && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 3,
            background: t.offlineBg, color: t.warn, fontWeight: 700,
          }}>⚠ OFFLINE · 3 queued</span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: online ? t.ok : t.err,
          }}/>
          {online ? 'WiFi –52dBm' : 'NO LINK'}
        </span>
        <span>87%</span>
        <span>14:32</span>
      </div>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function ScreenHeader({ theme, scale, title, crumb }) {
  const t = THEMES[theme];
  return (
    <div style={{
      padding: `${14 * scale}px ${16 * scale}px`,
      background: t.surfaceAlt,
      borderBottom: `2px solid ${t.border}`,
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: Math.max(11, 11 * scale), color: t.textMuted, letterSpacing: 0.8,
        textTransform: 'uppercase', marginBottom: 4,
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      }}>
        {crumb}
      </div>
      <div style={{
        fontSize: Math.max(22, 22 * scale), fontWeight: 700, color: t.text,
        letterSpacing: -0.3,
      }}>
        {title}
      </div>
    </div>
  );
}

// ============================================================
// MENU TILE — big touch target
// ============================================================
function MenuTile({ item, hotkey, focused, theme, scale, size, onClick }) {
  const t = THEMES[theme];
  const tileH = size === 'lg' ? 130 * scale : 92; // >= 92px
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: size === 'lg' ? 18 * scale : 14,
        background: focused ? t.accent : t.surface,
        color: focused ? t.accentText : t.text,
        border: `2px solid ${focused ? t.accent : t.border}`,
        borderRadius: 6,
        textAlign: 'left', cursor: 'pointer',
        minHeight: tileH,
        outline: 'none',
        transition: 'background 0.08s, border 0.08s, transform 0.06s',
        fontFamily: 'inherit',
        touchAction: 'manipulation',
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: size === 'lg' ? 36 * scale : 28,
          lineHeight: 1, color: focused ? t.accentText : t.text,
        }}>{item.icon}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: size === 'lg' ? 14 * scale : 13, fontWeight: 800,
          padding: size === 'lg' ? `${4 * scale}px ${8 * scale}px` : '3px 7px',
          borderRadius: 3,
          background: focused ? 'rgba(0,0,0,0.15)' : t.surfaceAlt,
          border: `1px solid ${focused ? 'transparent' : t.border}`,
          color: focused ? t.accentText : t.textMuted,
          minWidth: 22,
          textAlign: 'center',
        }}>{hotkey}</span>
      </div>
      <div>
        <div style={{
          fontSize: size === 'lg' ? 20 * scale : 16,
          fontWeight: 700, letterSpacing: -0.2,
          marginBottom: 3,
        }}>{item.label}</div>
        <div style={{
          fontSize: size === 'lg' ? 14 * scale : 12,
          opacity: 0.75,
        }}>{item.ru}</div>
      </div>
    </button>
  );
}

// ============================================================
// FIELD ROW — bigger touch target, bigger type
// ============================================================
function FieldRow({ label, hint, focused, theme, scale, children, rightSlot, warning, error }) {
  const t = THEMES[theme];
  const leftBar = error ? t.err : warning ? t.warn : focused ? t.accent : 'transparent';
  return (
    <div style={{
      padding: `${14 * scale}px ${16 * scale}px`,
      background: focused ? t.surface : t.surface,
      borderLeft: `4px solid ${leftBar}`,
      borderBottom: `1px solid ${t.border}`,
      minHeight: 72, // tall row for gloves
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <label style={{
          fontSize: Math.max(12, 12 * scale), textTransform: 'uppercase', letterSpacing: 0.5,
          color: error ? t.err : warning ? t.warn : focused ? t.accent : t.textMuted,
          fontWeight: 800,
          fontFamily: 'JetBrains Mono, monospace',
        }}>{label}</label>
        {rightSlot}
      </div>
      {children}
      {hint && (
        <div style={{
          fontSize: Math.max(12, 12 * scale),
          color: error ? t.err : warning ? t.warn : t.textMuted,
          marginTop: 6, fontWeight: error || warning ? 600 : 400,
          fontFamily: 'JetBrains Mono, monospace',
        }}>{hint}</div>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, theme, scale, mono, scannable }) {
  const t = THEMES[theme];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
          fontSize: Math.max(20, 20 * scale), color: t.text, padding: '4px 0',
          fontWeight: mono ? 700 : 500,
          minHeight: 32,
        }}
      />
      {scannable && (
        <span style={{
          fontSize: 11, color: t.textMuted,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          padding: '4px 8px',
          border: `1px dashed ${t.border}`, borderRadius: 3,
        }}>SCAN</span>
      )}
    </div>
  );
}

function NumberStepper({ value, onChange, unit, theme, scale, expected }) {
  const t = THEMES[theme];
  // 56x56 touch targets minimum
  const btnSize = Math.max(56, 56 * scale);
  const btn = {
    width: btnSize, height: btnSize, borderRadius: 4,
    background: t.surfaceAlt, border: `2px solid ${t.border}`,
    color: t.text, fontSize: Math.max(26, 26 * scale), fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    touchAction: 'manipulation', flexShrink: 0,
  };
  const over = expected && value > expected;
  const under = expected && value < expected && value > 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button style={btn} onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
          fontSize: Math.max(32, 32 * scale),
          color: over ? t.err : under ? t.warn : t.text,
          textAlign: 'center', minWidth: 80,
        }}
      />
      <button style={btn} onClick={() => onChange(value + 1)}>+</button>
      <span style={{
        fontSize: Math.max(14, 14 * scale), color: t.textMuted,
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
        minWidth: 36, textAlign: 'right',
      }}>{unit}</span>
    </div>
  );
}

function Dropdown({ value, onChange, options, theme, scale, open, onToggle }) {
  const t = THEMES[theme];
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', background: 'transparent', border: 'none',
          padding: '6px 0', color: t.text, fontSize: Math.max(20, 20 * scale),
          fontWeight: 600, cursor: 'pointer', outline: 'none',
          fontFamily: 'inherit', minHeight: 44,
        }}
      >
        <span>{value || '— выберите —'}</span>
        <span style={{ fontSize: 16, color: t.textMuted }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
          background: t.surface, border: `2px solid ${t.borderStrong}`,
          borderRadius: 4, maxHeight: 240, overflowY: 'auto',
          boxShadow: t.shadow, marginTop: 4,
        }}>
          {options.map((opt, i) => (
            <div key={i} onClick={() => { onChange(opt); onToggle(); }}
              style={{
                padding: '14px 16px',
                borderBottom: i < options.length - 1 ? `1px solid ${t.border}` : 'none',
                cursor: 'pointer', fontSize: Math.max(16, 16 * scale), color: t.text,
                minHeight: 48, display: 'flex', alignItems: 'center',
                fontWeight: value === opt ? 700 : 500,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceAlt}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function DateInput({ value, onChange, theme, scale }) {
  const t = THEMES[theme];
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', background: 'transparent', border: 'none', outline: 'none',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: Math.max(20, 20 * scale),
        color: t.text, padding: '6px 0', fontWeight: 700,
        colorScheme: theme === 'night' ? 'dark' : 'light',
        minHeight: 40,
      }}
    />
  );
}

// ============================================================
// ACTION BAR — big F-keys + pagination
// ============================================================
function ActionBar({ theme, scale, actions, page, pages, onPrev, onNext }) {
  const t = THEMES[theme];
  // 56+ minimum height
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      borderTop: `2px solid ${t.border}`, background: t.surfaceAlt,
      minHeight: 64, flexShrink: 0,
    }}>
      {actions.map((a, i) => (
        <button key={i} onClick={a.onClick}
          style={{
            flex: 1, padding: '10px 6px',
            background: a.primary ? t.accent : 'transparent',
            color: a.primary ? t.accentText : t.text,
            border: 'none', borderRight: i < actions.length - 1 ? `1px solid ${t.border}` : 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
            fontFamily: 'inherit', minHeight: 64, minWidth: 64,
            touchAction: 'manipulation',
          }}
          onMouseDown={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseUp={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <KeyCap theme={theme} wide>{a.key}</KeyCap>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</span>
        </button>
      ))}
      {pages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 14px',
          borderLeft: `1px solid ${t.border}`,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13, color: t.textMuted,
        }}>
          <button onClick={onPrev} style={{
            width: 48, height: 48, borderRadius: 4,
            background: t.surface, border: `2px solid ${t.border}`,
            color: t.text, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 20, fontWeight: 700,
          }}>‹</button>
          <span style={{ minWidth: 48, textAlign: 'center', fontWeight: 800, color: t.text, fontSize: 14 }}>
            {page}/{pages}
          </span>
          <button onClick={onNext} style={{
            width: 48, height: 48, borderRadius: 4,
            background: t.surface, border: `2px solid ${t.border}`,
            color: t.text, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 20, fontWeight: 700,
          }}>›</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCANNER FEEDBACK — flash overlay + beep visual
// ============================================================
function ScannerFlash({ active, tone, theme }) {
  const t = THEMES[theme];
  const color = tone === 'err' ? t.err : t.accent;
  if (!active) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 90,
      boxShadow: `inset 0 0 0 6px ${color}`,
      animation: 'scanFlash 0.45s ease-out',
    }}/>
  );
}

// ============================================================
// APP — screens
// ============================================================
function WMSApp({ theme, scale, layout, size, scannerValue, onScannerConsumed, online }) {
  const t = THEMES[theme];
  const [screen, setScreen] = useState('menu');
  const [submenuOf, setSubmenuOf] = useState(null);
  const [menuFocus, setMenuFocus] = useState(0);
  const [menuPage, setMenuPage] = useState(0);
  const [subFocus, setSubFocus] = useState(0);

  const [form, setForm] = useState({
    docNo: '', sku: '', skuName: '',
    qty: 0, uom: 'pcs',
    lot: '', expiry: '', bin: '',
  });
  const [expected, setExpected] = useState(null); // ASN expected row
  const [fieldFocus, setFieldFocus] = useState(0);
  const [formPage, setFormPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [toast, setToast] = useState(null);
  const [flash, setFlash] = useState(null);
  const contentRef = useRef(null);

  const showToast = (msg, tone = 'ok') => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2500);
  };
  const doFlash = (tone) => {
    setFlash({ tone, id: Date.now() });
    setTimeout(() => setFlash(null), 450);
  };

  // ---------- FIELD DEFS ----------
  const FIELDS = [
    { key: 'docNo', type: 'scan', label: 'Номер накладной / ASN', hint: 'Сканируйте штрихкод УПД или введите вручную', placeholder: 'ASN-2026-______' },
    { key: 'sku', type: 'scan', label: 'SKU / штрихкод товара', hint: 'Сканируйте штрихкод единицы', placeholder: '4607010______' },
    { key: 'qty', type: 'number', label: 'Количество', hint: 'F5 — полный короб' },
    { key: 'uom', type: 'dropdown', label: 'Единица измерения', hint: 'Выберите из списка', options: UOM },
    { key: 'lot', type: 'text', label: 'Номер партии / лот', hint: 'Если указан на упаковке', placeholder: 'LOT-____' },
    { key: 'expiry', type: 'date', label: 'Срок годности', hint: 'дд.мм.гггг' },
    { key: 'bin', type: 'scan', label: 'Ячейка размещения', hint: 'Сканируйте этикетку ячейки', placeholder: 'A-01-02-03' },
  ];

  // ---------- VALIDATION / WARNINGS ----------
  const getFieldState = (f) => {
    const v = form[f.key];
    if (f.key === 'sku' && v) {
      if (!ASN_EXPECTED[v]) return { error: true, msg: `✕ Штрихкод не найден в накладной. Проверьте товар.` };
      return { ok: true, msg: `✓ ${form.skuName}` };
    }
    if (f.key === 'qty' && expected) {
      if (form.qty > expected.qty) return { warn: true, msg: `⚠ Превышение: ожидалось ${expected.qty} ${expected.uom}. Требуется подтверждение.` };
      if (form.qty > 0 && form.qty < expected.qty) return { warn: true, msg: `⚠ Недостача: ${expected.qty - form.qty} ${expected.uom} не хватает` };
      if (form.qty === expected.qty) return { ok: true, msg: `✓ Совпадает с накладной` };
    }
    if (f.key === 'bin' && v) {
      if (!VALID_BINS.includes(v)) return { error: true, msg: `✕ Ячейка не существует или закрыта` };
      if (expected && v !== expected.bin) return { warn: true, msg: `⚠ Рекомендуемая ячейка: ${expected.bin}` };
      return { ok: true, msg: `✓ Ячейка свободна` };
    }
    return {};
  };

  // ---------- MENU PAGINATION (by count) ----------
  const perPageMenu = layout === 'landscape' ? 8 : 6; // forces page 2 when there are 16 items
  const menuPages = Math.ceil(MENU_ROOT.length / perPageMenu);
  const menuItems = MENU_ROOT.slice(menuPage * perPageMenu, (menuPage + 1) * perPageMenu);

  // ---------- FORM PAGINATION (by height) ----------
  // On compact TSD, 4 fields per "page" so you can SEE the scroll break visually.
  const fieldsPerPage = layout === 'landscape' ? 7 : 4;
  const formPages = Math.ceil(FIELDS.length / fieldsPerPage);
  const visibleFields = FIELDS.slice(formPage * fieldsPerPage, (formPage + 1) * fieldsPerPage);

  const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleBack = () => {
    if (screen === 'receive') { setScreen('submenu'); setFieldFocus(0); }
    else if (screen === 'submenu') { setScreen('menu'); }
  };

  const handleMenuSelect = (idx) => {
    const item = menuItems[idx];
    if (!item) return;
    if (item.id === 'inbound') {
      setSubmenuOf(item); setScreen('submenu'); setSubFocus(0);
    } else {
      showToast(`${item.label}: раздел не подключён в демо`, 'warn');
    }
  };
  const handleSubSelect = (idx) => {
    const item = INBOUND_SUB[idx];
    if (!item) return;
    setScreen('receive'); setFieldFocus(0); setFormPage(0);
  };

  // ---------- SCANNER CONSUME ----------
  useEffect(() => {
    if (!scannerValue) return;
    if (screen === 'receive') {
      const f = FIELDS[fieldFocus];
      if (f && (f.type === 'scan' || f.type === 'text')) {
        if (f.key === 'sku') {
          const row = ASN_EXPECTED[scannerValue];
          if (row) {
            setForm((x) => ({ ...x, sku: scannerValue, skuName: row.name, uom: row.uom }));
            setExpected(row);
            showToast(`✓ ${row.name}`, 'ok');
            doFlash('ok');
          } else {
            setForm((x) => ({ ...x, sku: scannerValue, skuName: '' }));
            setExpected(null);
            showToast(`✕ Неизвестный штрихкод — проверьте товар`, 'err');
            doFlash('err');
            onScannerConsumed();
            return;
          }
        } else if (f.key === 'bin') {
          if (VALID_BINS.includes(scannerValue)) {
            updateForm('bin', scannerValue);
            showToast(`✓ Ячейка принята`, 'ok');
            doFlash('ok');
          } else {
            updateForm('bin', scannerValue);
            showToast(`✕ Ячейка не найдена`, 'err');
            doFlash('err');
            onScannerConsumed();
            return;
          }
        } else {
          updateForm(f.key, scannerValue);
          showToast(`✓ Scan → ${f.label}`, 'ok');
          doFlash('ok');
        }
        if (fieldFocus < FIELDS.length - 1) setFieldFocus(fieldFocus + 1);
      }
    } else {
      showToast('Сканер игнорируется на этом экране', 'warn');
      doFlash('err');
    }
    onScannerConsumed();
  }, [scannerValue]);

  // ---------- KEYBOARD ----------
  useKeyboard((e) => {
    const inField = e.target.tagName === 'INPUT';
    if (inField && e.key !== 'Escape' && !(e.key.startsWith('F') && e.key.length > 1)) {
      if (e.key === 'Enter' && screen === 'receive') {
        e.preventDefault();
        if (fieldFocus < FIELDS.length - 1) {
          const next = fieldFocus + 1;
          setFieldFocus(next);
          const nextPage = Math.floor(next / fieldsPerPage);
          if (nextPage !== formPage) setFormPage(nextPage);
        } else doSave();
      }
      return;
    }
    if (e.key === 'Escape') handleBack();
    if (e.key === 'F2') { e.preventDefault(); doSave(); }
    if (e.key === 'F3') { e.preventDefault(); handleBack(); }
    if (e.key === 'F4') { e.preventDefault(); doClear(); }
    if (screen === 'menu') {
      if (e.key >= '1' && e.key <= '9') {
        const n = Number(e.key) - 1;
        if (n < menuItems.length) handleMenuSelect(n);
      }
      const cols = layout === 'landscape' ? 4 : 2;
      if (e.key === 'ArrowRight') setMenuFocus(Math.min(menuItems.length - 1, menuFocus + 1));
      if (e.key === 'ArrowLeft') setMenuFocus(Math.max(0, menuFocus - 1));
      if (e.key === 'ArrowDown') setMenuFocus(Math.min(menuItems.length - 1, menuFocus + cols));
      if (e.key === 'ArrowUp') setMenuFocus(Math.max(0, menuFocus - cols));
      if (e.key === 'Enter') handleMenuSelect(menuFocus);
      if (e.key === 'PageDown') setMenuPage(Math.min(menuPages - 1, menuPage + 1));
      if (e.key === 'PageUp') setMenuPage(Math.max(0, menuPage - 1));
    }
    if (screen === 'submenu') {
      if (e.key >= '1' && e.key <= '9') {
        const n = Number(e.key) - 1;
        if (n < INBOUND_SUB.length) handleSubSelect(n);
      }
      if (e.key === 'ArrowDown') setSubFocus(Math.min(INBOUND_SUB.length - 1, subFocus + 1));
      if (e.key === 'ArrowUp') setSubFocus(Math.max(0, subFocus - 1));
      if (e.key === 'Enter') handleSubSelect(subFocus);
    }
    if (screen === 'receive') {
      if (e.key === 'PageDown') setFormPage(Math.min(formPages - 1, formPage + 1));
      if (e.key === 'PageUp') setFormPage(Math.max(0, formPage - 1));
    }
  }, [screen, menuFocus, menuItems.length, menuPage, menuPages, fieldFocus, formPage, formPages, subFocus]);

  const doSave = () => {
    if (screen !== 'receive') return;
    if (!form.docNo || !form.sku || !form.qty) {
      showToast('Заполните: документ, SKU, количество', 'err');
      return;
    }
    showToast(`✓ Сохранено: ${form.qty} ${form.uom} · ${form.sku}`, 'ok');
    doClear();
  };
  const doClear = () => {
    setForm({ docNo: '', sku: '', skuName: '', qty: 0, uom: 'pcs', lot: '', expiry: '', bin: '' });
    setExpected(null); setFieldFocus(0); setFormPage(0);
  };

  // ============================================================
  // RENDER
  // ============================================================
  let header, content, footer;

  if (screen === 'menu') {
    header = <ScreenHeader theme={theme} scale={scale}
      crumb={`ГЛАВНОЕ МЕНЮ · СТР ${menuPage + 1} ИЗ ${menuPages}`}
      title="Главное меню" />;
    const cols = layout === 'landscape' ? 4 : 2;
    content = (
      <div style={{
        flex: 1, padding: 14, overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: 'minmax(0, 1fr)',
        gap: 10, alignContent: 'stretch',
      }}>
        {menuItems.map((item, i) => (
          <MenuTile key={item.id} item={item} hotkey={i + 1}
            focused={menuFocus === i} theme={theme} scale={scale}
            size={layout === 'landscape' ? 'lg' : 'sm'}
            onClick={() => { setMenuFocus(i); handleMenuSelect(i); }}
          />
        ))}
      </div>
    );
    footer = (
      <ActionBar theme={theme} scale={scale}
        page={menuPage + 1} pages={menuPages}
        onPrev={() => setMenuPage(Math.max(0, menuPage - 1))}
        onNext={() => setMenuPage(Math.min(menuPages - 1, menuPage + 1))}
        actions={[
          { key: '1–9', label: 'Выбор', onClick: () => {} },
          { key: 'Enter', label: 'Открыть', primary: true, onClick: () => handleMenuSelect(menuFocus) },
          { key: 'Esc', label: 'Выход', onClick: () => showToast('Выход из сессии', 'warn') },
        ]}
      />
    );
  }

  if (screen === 'submenu') {
    header = <ScreenHeader theme={theme} scale={scale}
      crumb={`ГЛАВНОЕ / ${submenuOf?.label?.toUpperCase()}`}
      title={submenuOf?.ru || submenuOf?.label} />;
    content = (
      <div style={{ flex: 1, overflowY: 'auto', background: t.surface }}>
        {INBOUND_SUB.map((item, i) => (
          <button key={item.id} onClick={() => { setSubFocus(i); handleSubSelect(i); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: 14, padding: '18px 16px', minHeight: 68,
              background: subFocus === i ? t.accent : 'transparent',
              color: subFocus === i ? t.accentText : t.text,
              border: 'none', borderBottom: `1px solid ${t.border}`,
              borderLeft: `4px solid ${subFocus === i ? t.accent : 'transparent'}`,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
            }}>
            <span style={{
              width: 44, height: 44, borderRadius: 4,
              background: subFocus === i ? 'rgba(0,0,0,0.15)' : t.surfaceAlt,
              border: `1px solid ${subFocus === i ? 'transparent' : t.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 17, fontWeight: 800,
              color: subFocus === i ? t.accentText : t.text, flexShrink: 0,
            }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>{item.ru}</div>
            </div>
            <span style={{ fontSize: 22, opacity: 0.4 }}>›</span>
          </button>
        ))}
      </div>
    );
    footer = (
      <ActionBar theme={theme} scale={scale} pages={1} page={1}
        actions={[
          { key: '↑↓', label: 'Навигация', onClick: () => {} },
          { key: 'Enter', label: 'Открыть', primary: true, onClick: () => handleSubSelect(subFocus) },
          { key: 'Esc', label: 'Назад', onClick: handleBack },
        ]}
      />
    );
  }

  if (screen === 'receive') {
    header = <ScreenHeader theme={theme} scale={scale}
      crumb={`INBOUND / ASN RECEIPT · ПОЛЯ ${formPage * fieldsPerPage + 1}–${Math.min((formPage + 1) * fieldsPerPage, FIELDS.length)} ИЗ ${FIELDS.length}`}
      title="Приёмка товара" />;
    const filledCount = [form.docNo, form.sku, form.qty, form.uom, form.lot, form.expiry, form.bin].filter(Boolean).length;
    const scanStrip = (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: t.scanBg, borderBottom: `1px solid ${t.border}`,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13, flexShrink: 0,
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: t.accent, boxShadow: `0 0 10px ${t.accent}`,
          animation: 'pulse 1.6s infinite',
        }}/>
        <span style={{ color: t.text, fontWeight: 800 }}>Сканер наведён</span>
        <span style={{ color: t.textMuted }}>→ {FIELDS[fieldFocus]?.label}</span>
        <span style={{ marginLeft: 'auto', color: t.textMuted, fontWeight: 700 }}>
          {filledCount}/{FIELDS.length}
        </span>
      </div>
    );
    // Show ASN expected row when known
    const asnBanner = expected && (
      <div style={{
        padding: '10px 16px',
        background: t.surfaceAlt, borderBottom: `1px solid ${t.border}`,
        display: 'flex', gap: 14, alignItems: 'center',
        fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
        flexShrink: 0,
      }}>
        <Chip tone="accent" theme={theme}>ASN</Chip>
        <span style={{ color: t.textMuted }}>ожид:</span>
        <span style={{ color: t.text, fontWeight: 800 }}>{expected.qty} {expected.uom}</span>
        <span style={{ color: t.textMuted }}>яч:</span>
        <span style={{ color: t.text, fontWeight: 800 }}>{expected.bin}</span>
      </div>
    );

    content = (
      <div ref={contentRef} style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', background: t.surface, position: 'relative',
      }}>
        {scanStrip}
        {asnBanner}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {visibleFields.map((f, idxLocal) => {
            const globalIdx = formPage * fieldsPerPage + idxLocal;
            const focused = fieldFocus === globalIdx;
            const v = form[f.key];
            const state = getFieldState(f);
            let widget;
            if (f.type === 'scan' || f.type === 'text') {
              widget = <TextInput value={v || ''} onChange={(val) => updateForm(f.key, val)}
                placeholder={f.placeholder} theme={theme} scale={scale}
                mono={f.type === 'scan'} scannable={f.type === 'scan'} />;
            } else if (f.type === 'number') {
              widget = <NumberStepper value={v || 0} onChange={(val) => updateForm(f.key, val)}
                unit={form.uom} theme={theme} scale={scale}
                expected={expected?.qty} />;
            } else if (f.type === 'dropdown') {
              widget = <Dropdown value={v} onChange={(val) => updateForm(f.key, val)}
                options={f.options} theme={theme} scale={scale}
                open={dropdownOpen === f.key}
                onToggle={() => { setDropdownOpen(dropdownOpen === f.key ? null : f.key); setFieldFocus(globalIdx); }} />;
            } else if (f.type === 'date') {
              widget = <DateInput value={v} onChange={(val) => updateForm(f.key, val)} theme={theme} scale={scale} />;
            }
            return (
              <div key={f.key} onClick={() => setFieldFocus(globalIdx)}>
                <FieldRow theme={theme} scale={scale} focused={focused}
                  warning={state.warn} error={state.error}
                  label={`${globalIdx + 1}. ${f.label}`}
                  hint={state.msg || f.hint}
                  rightSlot={
                    state.error ? <Chip tone="err" theme={theme}>ОШИБКА</Chip>
                    : state.warn ? <Chip tone="warn" theme={theme}>ВНИМАНИЕ</Chip>
                    : state.ok ? <Chip tone="ok" theme={theme}>OK</Chip>
                    : focused ? <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
                        color: t.accent,
                      }}>● ВВОД</span>
                    : null
                  }
                >{widget}</FieldRow>
              </div>
            );
          })}
        </div>
      </div>
    );

    footer = <ActionBar theme={theme} scale={scale}
      page={formPage + 1} pages={formPages}
      onPrev={() => { setFormPage(Math.max(0, formPage - 1)); setFieldFocus(Math.max(0, formPage - 1) * fieldsPerPage); }}
      onNext={() => { const np = Math.min(formPages - 1, formPage + 1); setFormPage(np); setFieldFocus(np * fieldsPerPage); }}
      actions={[
        { key: 'F2', label: 'Сохранить', primary: true, onClick: doSave },
        { key: 'F3', label: 'Назад', onClick: handleBack },
        { key: 'F4', label: 'Сброс', onClick: doClear },
      ]}
    />;
  }

  return (
    <div style={{
      width: size.w, height: size.h,
      background: t.bg, color: t.text,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <StatusBar theme={theme} scale={scale} online={online} />
      {header}
      {content}
      {footer}
      <ScannerFlash active={!!flash} tone={flash?.tone} theme={theme} />
      {toast && (
        <div style={{
          position: 'absolute', left: 14, right: 14, bottom: 78,
          padding: '14px 16px',
          background: toast.tone === 'ok' ? t.ok : toast.tone === 'err' ? t.err : t.warn,
          color: '#fff', borderRadius: 4,
          fontSize: 15, fontWeight: 700,
          boxShadow: t.shadow, zIndex: 100,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: 0.2,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DEVICE FRAMES
// ============================================================
function HandheldFrame({ children }) {
  return (
    <div style={{
      position: 'relative',
      width: 560, padding: '34px 24px 120px 24px',
      background: '#1a1a1a',
      borderRadius: 28,
      boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        position: 'absolute', top: -18, left: 0, right: 0, height: 32,
        background: 'linear-gradient(180deg, #2a2a2a, #1a1a1a)',
        borderRadius: '28px 28px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, color: '#666', letterSpacing: 2,
      }}>
        <span style={{ width: 40, height: 6, background: '#0a0a0a', borderRadius: 1 }}/>
        SCANNER
        <span style={{ width: 40, height: 6, background: '#0a0a0a', borderRadius: 1 }}/>
      </div>
      <div style={{
        width: 480, height: 800, borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 0 0 2px #000, inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        {children}
      </div>
      <div style={{
        marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6,
      }}>
        {['F1','F2','F3','F4','F5',
          '1','2','3','4','5',
          '6','7','8','9','0',
          '↑','↓','←','→','ESC',
          'TAB','SP','·','BKSP','ENT'].map((k, i) => (
          <div key={i} style={{
            padding: '7px 0', textAlign: 'center',
            background: 'linear-gradient(180deg, #2e2e2e, #1a1a1a)',
            border: '1px solid #0a0a0a',
            borderRadius: 4, color: '#aaa',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, fontWeight: 700,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>{k}</div>
        ))}
      </div>
    </div>
  );
}

function ForkliftFrame({ children }) {
  return (
    <div style={{
      position: 'relative', padding: 30,
      background: 'linear-gradient(180deg, #2a2a28, #1a1a18)',
      borderRadius: 10,
      boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
        width: 60, height: 40,
        background: 'linear-gradient(180deg, #444, #222)',
        borderRadius: '6px 6px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#111', border: '2px solid #555' }}/>
      </div>
      {[[8,'auto','auto',8],[8,8,'auto','auto'],['auto','auto',8,8],['auto',8,8,'auto']].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', top: pos[0], right: pos[1], bottom: pos[2], left: pos[3],
          width: 14, height: 14, borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #888, #333)',
          border: '1px solid #0a0a0a',
        }}/>
      ))}
      <div style={{
        width: 1024, height: 768, borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 0 0 3px #000, inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', bottom: 10, right: 20,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, color: '#666', letterSpacing: 1,
      }}>FORKLIFT TERMINAL · 10.4" · IP65</div>
    </div>
  );
}

// ============================================================
// STAGE
// ============================================================
function Stage() {
  const [theme, setTheme] = useState('night');
  const [scanInput, setScanInput] = useState('');
  const [scannerFire, setScannerFire] = useState({ value: null });
  const [zoom, setZoom] = useState(0.7);
  const [online, setOnline] = useState(true);

  const fireScanner = (val) => {
    if (!val) {
      const samples = [
        '4607010240158', '4607010240165', '4607010240189',
        'ASN-2026-00417', 'A-01-02-03', 'LOT-2026-H8',
        '9999999999999', // unknown
        'X-99-99-99', // bad bin
      ];
      val = samples[Math.floor(Math.random() * samples.length)];
    }
    setScannerFire({ value: val });
  };
  const clearScanner = useCallback(() => setScannerFire({ value: null }), []);

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: theme === 'night'
        ? 'radial-gradient(circle at 30% 20%, #1a1d4a, #06071a)'
        : 'radial-gradient(circle at 30% 20%, #1a3a38, #041011)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
      color: '#e8eaff',
    }}>
      {/* TOP BAR */}
      <div style={{
        padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 4,
            background: theme === 'night' ? '#9b9de6' : '#00cbaa',
            color: theme === 'night' ? '#0f1028' : '#00201b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: 15,
          }}>RF</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.2 }}>WebRF</div>
            <div style={{ fontSize: 11, color: '#8a90c0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.4 }}>
              WAREHOUSE TERMINAL · WEB
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        {/* scanner sim */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', borderRadius: 4,
          background: theme === 'night' ? 'rgba(155, 157, 230, 0.14)' : 'rgba(0, 203, 170, 0.18)',
          border: `1px solid ${theme === 'night' ? 'rgba(155, 157, 230, 0.35)' : 'rgba(0, 203, 170, 0.5)'}`,
        }}>
          <span style={{
            fontSize: 11, color: theme === 'night' ? '#9b9de6' : '#00cbaa',
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: 0.5,
          }}>SCANNER</span>
          <input
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { fireScanner(scanInput); setScanInput(''); }
            }}
            placeholder="код + Enter"
            style={{
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', padding: '6px 10px', borderRadius: 3,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 13, width: 180,
              outline: 'none', minHeight: 32,
            }}/>
          <button onClick={() => { fireScanner(scanInput); setScanInput(''); }}
            style={{
              padding: '7px 14px', borderRadius: 3, border: 'none',
              background: theme === 'night' ? '#9b9de6' : '#00cbaa',
              color: theme === 'night' ? '#0f1028' : '#00201b',
              fontWeight: 800, fontSize: 12, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: 0.3,
            }}>TRIGGER</button>
          <button onClick={() => fireScanner(null)}
            style={{
              padding: '7px 12px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: '#fff',
              fontSize: 11, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
            }}>RANDOM</button>
        </div>

        {/* offline toggle */}
        <button onClick={() => setOnline(!online)}
          style={{
            padding: '7px 12px', borderRadius: 3,
            border: `1px solid ${online ? 'rgba(255,255,255,0.15)' : '#ffb347'}`,
            background: online ? 'transparent' : 'rgba(255,179,71,0.15)',
            color: online ? '#fff' : '#ffb347',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.3,
          }}>{online ? 'ONLINE' : 'OFFLINE'}</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#8a90c0', fontFamily: 'JetBrains Mono, monospace' }}>ZOOM</span>
          <input type="range" min="0.4" max="1" step="0.05" value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))} style={{ width: 80 }}/>
          <span style={{ fontSize: 12, color: '#fff', fontFamily: 'JetBrains Mono, monospace', minWidth: 36 }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div style={{
          display: 'flex', background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 2,
        }}>
          {['day', 'night'].map((m) => (
            <button key={m} onClick={() => setTheme(m)}
              style={{
                padding: '7px 14px', borderRadius: 3, border: 'none',
                background: theme === m ? (m === 'night' ? '#9b9de6' : '#00cbaa') : 'transparent',
                color: theme === m ? (m === 'night' ? '#0f1028' : '#00201b') : '#fff',
                fontWeight: 800, fontSize: 12, cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}>{m === 'day' ? 'Teal' : 'Indigo'}</button>
          ))}
        </div>
      </div>

      {/* CANVAS */}
      <div style={{
        flex: 1, padding: '40px 40px 60px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
      }}>
        <div style={{ width: '100%', maxWidth: 1800, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            fontSize: 11, color: '#8a90c0', letterSpacing: 1,
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          }}>WEBRF V2 · ОДИН КОД · ДВА ФОРМ-ФАКТОРА</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.3 }}>
            Главное меню + экран приёмки
          </div>
          <div style={{ fontSize: 14, color: '#8a90c0', maxWidth: 880, lineHeight: 1.6 }}>
            16 пунктов меню → автоматическая пагинация (ТСД: 2×3 · 3 страницы / погрузчик: 4×2 · 2 страницы).
            Форма приёмки на ТСД разбита на 2 страницы по высоте (4+3 поля). Tap-targets ≥56px,
            Enter/F-ключи/стрелки, сканер с ответной вспышкой, OK/WARN/ERR состояния
            (расхождение qty, неизвестный SKU, неверная ячейка), OFFLINE-индикатор c очередью.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center',
              marginBottom: `calc(${(1 - zoom) * -900}px)` }}>
              <HandheldFrame>
                <WMSApp theme={theme} scale={1} layout="portrait"
                  size={{ w: 480, h: 800 }}
                  scannerValue={scannerFire.value}
                  onScannerConsumed={clearScanner}
                  online={online}
                />
              </HandheldFrame>
            </div>
            <Label primary="ТСД Handheld" secondary="Zebra/Urovo · 480×800 · portrait · физ. клавиши" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center',
              marginBottom: `calc(${(1 - zoom) * -900}px)` }}>
              <ForkliftFrame>
                <WMSApp theme={theme} scale={1.3} layout="landscape"
                  size={{ w: 1024, h: 768 }}
                  scannerValue={scannerFire.value}
                  onScannerConsumed={clearScanner}
                  online={online}
                />
              </ForkliftFrame>
            </div>
            <Label primary="Forklift Terminal" secondary={'Rugged 10.4" · 1024×768 · landscape · для перчаток'} />
          </div>
        </div>

        <Legend />

        <TestScenarios onScan={fireScanner} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes scanFlash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.6; cursor: pointer; transform: scale(1.2);
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

function Label({ primary, secondary }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 360 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{primary}</div>
      <div style={{ fontSize: 12, color: '#8a90c0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.3 }}>
        {secondary}
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { k: '1–9', v: 'Прямой выбор пункта' },
    { k: '↑↓←→', v: 'Фокус' },
    { k: 'Enter', v: 'Подтв. / след. поле' },
    { k: 'Esc', v: 'Назад' },
    { k: 'F2', v: 'Сохранить' },
    { k: 'F3', v: 'Отмена / назад' },
    { k: 'F4', v: 'Сброс формы' },
    { k: 'PgUp/Dn', v: 'Смена страницы' },
    { k: 'Scanner', v: 'Заполняет текущее поле + flash' },
  ];
  return (
    <div style={{
      width: '100%', maxWidth: 1800,
      padding: 22, borderRadius: 6,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        fontSize: 11, color: '#8a90c0', letterSpacing: 1, marginBottom: 14,
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      }}>КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ</div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14,
      }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-block', padding: '3px 8px',
              borderRadius: 3, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
              color: '#fff', minWidth: 56, textAlign: 'center',
            }}>{it.k}</span>
            <span style={{ fontSize: 13, color: '#e8eaff' }}>{it.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestScenarios({ onScan }) {
  const scenarios = [
    { label: 'Сканировать известный SKU', code: '4607010240158', tone: 'ok' },
    { label: 'Неизвестный штрихкод (ERROR)', code: '9999999999999', tone: 'err' },
    { label: 'Номер накладной', code: 'ASN-2026-00417', tone: 'ok' },
    { label: 'Правильная ячейка', code: 'A-01-02-03', tone: 'ok' },
    { label: 'Ячейка не найдена (ERROR)', code: 'X-99-99-99', tone: 'err' },
    { label: 'Лот', code: 'LOT-2026-H8', tone: 'ok' },
  ];
  return (
    <div style={{
      width: '100%', maxWidth: 1800,
      padding: 22, borderRadius: 6,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        fontSize: 11, color: '#8a90c0', letterSpacing: 1, marginBottom: 14,
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      }}>ТЕСТОВЫЕ СЦЕНАРИИ СКАНЕРА — кликни чтобы отправить код</div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10,
      }}>
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => onScan(s.code)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 4,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${s.tone === 'err' ? 'rgba(255,107,107,0.4)' : 'rgba(155,157,230,0.3)'}`,
              color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              textAlign: 'left',
            }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
            <code style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: s.tone === 'err' ? '#ff6b6b' : '#9b9de6',
              padding: '3px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 3,
            }}>{s.code}</code>
          </button>
        ))}
      </div>
    </div>
  );
}

// MOUNT
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Stage />);
