import { useState } from 'react'
import { api } from '../api'
import { useI18n, CATEGORIES, getCategoryKey, STREAM_LANGUAGES, type Category } from '../i18n'

interface Props {
  onClose: () => void
  onSuccess: () => void
  flash: (text: string, type?: 'ok' | 'err') => void
}

export function CreateStreamModal ({ onClose, onSuccess, flash }: Props): JSX.Element {
  const { t, lang } = useI18n()
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCat, setNewCat] = useState<Category>('gaming')
  const [newLang, setNewLang] = useState(lang)
  const [newThumb, setNewThumb] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [newTags, setNewTags] = useState('')
  const [newMaxQuality, setNewMaxQuality] = useState('1080p')
  const [newDelay, setNewDelay] = useState(0)
  const [newMature, setNewMature] = useState(false)
  const [newChatFollowers, setNewChatFollowers] = useState(false)
  const [newChatSlow, setNewChatSlow] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0]
    if (f == null) return
    setNewThumb(f)
    setThumbPreview(URL.createObjectURL(f))
  }

  const handleCreate = async (): Promise<void> => {
    if (newTitle.trim().length < 3) { flash(t('titleMin'), 'err'); return }
    try {
      const parsedTags = newTags.split(/[,\s]+/).map(t => t.replace(/^#/, '').trim()).filter(t => t.length > 0).slice(0, 5)
      const res = await api.post('/streams', {
        title: newTitle.trim(),
        description: newDesc.trim(),
        category: newCat,
        language: newLang,
        tags: parsedTags,
        max_quality: newMaxQuality,
        delay_seconds: newDelay,
        mature_content: newMature,
        chat_followers_only: newChatFollowers,
        chat_slow_mode: newChatSlow
      })
      const streamId = res.data.stream.id
      if (newThumb != null) {
        const fd = new FormData()
        fd.append('file', newThumb)
        await api.post(`/streams/${streamId}/thumbnail`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      onSuccess()
    } catch { flash(t('createError'), 'err') }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => { e.stopPropagation() }}>
        <button className="modal-close" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
        <div className="modal-header"><h2>{t('createStream')}</h2></div>
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); void handleCreate() }}>
          <div className="form-group">
            <label>{t('streamTitle')} *</label>
            <input placeholder={t('streamTitlePlaceholder')} value={newTitle} onChange={(e) => { setNewTitle(e.target.value) }} maxLength={120} autoFocus />
          </div>
          <div className="form-group">
            <label>{t('streamDescription')}</label>
            <textarea placeholder={t('streamDescPlaceholder')} value={newDesc} onChange={(e) => { setNewDesc(e.target.value) }} maxLength={500} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group form-half">
              <label>{t('streamCategory')}</label>
              <select value={newCat} onChange={(e) => { setNewCat(e.target.value as Category) }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{t(getCategoryKey(c))}</option>)}
              </select>
            </div>
            <div className="form-group form-half">
              <label>{t('streamLanguage')}</label>
              <select value={newLang} onChange={(e) => { setNewLang(e.target.value as 'ua' | 'en' | 'no') }}>
                {STREAM_LANGUAGES.map(l => <option key={l} value={l}>{l === 'ua' ? '🇺🇦 Українська' : l === 'en' ? '🇬🇧 English' : '🇳🇴 Norsk'}</option>)}
              </select>
            </div>
          </div>
          <button type="button" className="btn-toggle-advanced" onClick={() => { setShowAdvanced(!showAdvanced) }}>
            {showAdvanced ? '▾' : '▸'} {t('advancedSettings')}
          </button>
          {showAdvanced && (
            <div className="advanced-settings">
              <div className="form-row">
                <div className="form-group form-half">
                  <label>{t('maxQuality')}</label>
                  <select value={newMaxQuality} onChange={(e) => { setNewMaxQuality(e.target.value) }}>
                    <option value="source">{t('source')}</option>
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                </div>
                <div className="form-group form-half">
                  <label>{t('delay')}</label>
                  <input type="number" min="0" max="900" value={newDelay} onChange={(e) => { setNewDelay(Number(e.target.value)) }} />
                  <span className="form-hint">{t('delayHint')}</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group form-half">
                  <label>{t('chatSlowMode')}</label>
                  <input type="number" min="0" max="300" value={newChatSlow} onChange={(e) => { setNewChatSlow(Number(e.target.value)) }} />
                  <span className="form-hint">{t('chatSlowHint')}</span>
                </div>
                <div className="form-group form-half" style={{ justifyContent: 'center', gap: '10px', paddingTop: '20px' }}>
                  <label className="toggle-label"><input type="checkbox" checked={newMature} onChange={(e) => { setNewMature(e.target.checked) }} /> {t('matureContent')}</label>
                  <label className="toggle-label"><input type="checkbox" checked={newChatFollowers} onChange={(e) => { setNewChatFollowers(e.target.checked) }} /> {t('chatFollowersOnly')}</label>
                </div>
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Теги / Hashtags</label>
            <input placeholder="#fps #ranked #competitive" value={newTags} onChange={(e) => { setNewTags(e.target.value) }} maxLength={100} />
            <span className="form-hint">До 5 тегів через кому або пробіл</span>
          </div>
          <div className="form-group">
            <label>{t('thumbnail')}</label>
            <div className="thumb-upload-area">
              {thumbPreview != null
                ? (
                <div className="thumb-preview">
                  <img src={thumbPreview} alt="preview" />
                  <button type="button" className="thumb-remove" onClick={() => { setNewThumb(null); setThumbPreview(null) }}>×</button>
                </div>
                  )
                : (
                <label className="thumb-dropzone">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  <span>{t('uploadThumbnail')}</span>
                  <span className="thumb-hint">{t('thumbnailHint')}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleThumbChange} hidden />
                </label>
                  )}
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full">{t('create')}</button>
        </form>
      </div>
    </div>
  )
}
