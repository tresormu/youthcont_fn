import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { KeyRound, CheckCircle2, Mail } from 'lucide-react';
import schoolReportService from '../../services/schoolReportService';
import { useToast } from '../../components/common/Toast';
import { schoolService } from '../../services/schoolService';

const GrantSchoolAccessPage = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [schools, setSchools] = useState<{ _id: string; name: string; ownerEmail?: string }[]>([]);
  const [schoolId, setSchoolId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    schoolService.getSchools(eventId).then(setSchools).catch(() => toast('Failed to load schools', 'error'));
  }, [eventId]);

  const handleSchoolChange = (id: string) => {
    setSchoolId(id);
    const school = schools.find(s => s._id === id);
    setEmail(school?.ownerEmail || '');
  };

  const handleGenerate = async () => {
    if (!schoolId || !email || !eventId) {
      toast('Please select a school and enter an email', 'error');
      return;
    }
    setLoading(true);
    try {
      await schoolReportService.generateAccess({ school_id: schoolId, email, event_id: eventId });
      setSentTo(email);
      setEmail('');
      setSchoolId('');
      toast('Access email sent!');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to generate access', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-primary">Grant School Access</h1>
        <p className="text-sm text-primary/50 mt-1">
          Select a school — the access email will be sent to their registered owner email.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-widest text-primary/40">Select School</label>
          <select
            value={schoolId}
            onChange={e => handleSchoolChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">— Choose a school —</option>
            {schools.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {email && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/40 border border-border text-sm text-primary/70">
            <Mail size={14} className="text-accent shrink-0" />
            <span>Will be sent to <strong>{email}</strong></span>
          </div>
        )}

        {schoolId && !email && (
          <p className="text-xs text-amber-600 font-medium px-1">
            This school has no registered owner email. Please update the school registration first.
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !schoolId || !email}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white font-black py-3 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50"
        >
          <KeyRound size={16} />
          {loading ? 'Sending...' : 'Grant Access & Send Email'}
        </button>
      </div>

      {sentTo && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-black text-emerald-800">Access email sent!</p>
            <p className="text-sm text-emerald-700 mt-1 flex items-center gap-1.5">
              <Mail size={13} />
              Credentials delivered to <strong>{sentTo}</strong>
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              The school owner will receive their access code. Access expires in 24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantSchoolAccessPage;

