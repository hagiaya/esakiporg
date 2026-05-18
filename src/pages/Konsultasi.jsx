import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Inbox, 
  Search, 
  Filter, 
  Paperclip, 
  Send, 
  Sparkles, 
  Star, 
  UserCheck, 
  ChevronRight, 
  Folder, 
  FileText, 
  Share2, 
  Eye, 
  RefreshCw, 
  Trash2, 
  ArrowRight,
  GitBranch,
  Target,
  FileCheck
} from 'lucide-react';

// SAKIP components list for integration selection
const SAKIP_INTEGRATION_ITEMS = {
  'Pohon Kinerja': [
    { id: 'pk-node-rt1', type: 'RT', code: 'RT-1', name: 'Meningkatkan derajat kesehatan masyarakat', target: '85.50%' },
    { id: 'pk-node-rs1', type: 'RS', code: 'RS-1', name: 'Meningkatnya akses dan mutu pelayanan kesehatan menuju cakupan semesta', target: '90%' },
    { id: 'pk-node-ro1', type: 'RO', code: 'RO-1', name: 'Meningkatnya kualitas kesehatan perorangan dan masyarakat', target: '100%' },
    { id: 'pk-node-rk1', type: 'RK', code: '1.02.02.1.01', name: 'Penyediaan Fasilitas Pelayanan, Sarana, Prasarana dan Alat Kesehatan untuk UKP Rujukan', target: '1 Dokumen', budget: 'Rp 45.200.000.000' },
    { id: 'pk-node-rsk1', type: 'RSK', code: '1.02.02.1.01.0004', name: 'Pengembangan Fasilitas Kesehatan Lainnya', target: '2 Unit', budget: 'Rp 12.500.000.000' },
    { id: 'pk-node-rsk2', type: 'RSK', code: '1.02.02.1.01.0010', name: 'Pengadaan Alat Kesehatan/Alat Penunjang Medik Fasyankes', target: '40 Set', budget: 'Rp 9.300.000.000' }
  ],
  'Perjanjian Kinerja': [
    { id: 'pk-item-1', type: 'Sasaran Strategis', name: 'Meningkatnya sarana prasarana kesehatan terstandar', target: '95%' },
    { id: 'pk-item-2', type: 'Indikator Kinerja Utama', name: 'Persentase rumah sakit kelas B terakreditasi paripurna', target: '100%' }
  ],
  'Renstra Visi & Sasaran': [
    { id: 'renstra-item-1', type: 'Visi', name: 'Terwujudnya Gorontalo yang Maju, Mandiri, dan Berkelanjutan' },
    { id: 'renstra-item-2', type: 'Sasaran Renstra', name: 'Meningkatnya Akses dan Mutu Pelayanan Kesehatan Menuju Cakupan Kesehatan Semesta' }
  ],
  'Laporan SAKIP': [
    { id: 'lap-item-1', type: 'Laporan Triwulan I', name: 'Realisasi Fisik & Keuangan Program Pemenuhan Upaya Kesehatan', progress: '75%' },
    { id: 'lap-item-2', type: 'Evaluasi Internal SAKIP', name: 'Nilai Evaluasi Mandiri SAKIP Tahun 2025 (Target: A)', current: '80.12 (B+)' }
  ],
  'Kamus Indikator': [
    { id: 'kamus-item-1', type: 'Definisi Indikator', name: 'Angka Kematian Bayi (AKB) per 1.000 Kelahiran Hidup', formula: '(Jumlah kematian bayi / Jumlah kelahiran hidup) x 1000' },
    { id: 'kamus-item-2', type: 'Definisi Indikator', name: '100% tahapan SPM Provinsi terpenuhi sesuai standar pada tahun 2026', formula: '(Tahapan SPM yang dipenuhi / Total tahapan SPM) x 100%' }
  ]
};

// Initial simulated consultation tickets
const INITIAL_TICKETS = [
  {
    id: 'ticket-1',
    ticketNumber: 'SAKIP-202605-0001',
    opdCode: 'DINKES',
    opdName: 'Dinas Kesehatan',
    title: 'Konsultasi Cascading Pohon Kinerja Level Sub-Kegiatan (RSK)',
    category: 'Pohon Kinerja',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdBy: 'dr. Yana Yanti Suleman, SH',
    assignedTo: 'Irwan Yusuf, S.Sos (Biro Organisasi)',
    sakipRef: { id: 'pk-node-rsk2', type: 'RSK', code: '1.02.02.1.01.0010', name: 'Pengadaan Alat Kesehatan/Alat Penunjang Medik Fasyankes', target: '40 Set', budget: 'Rp 9.300.000.000' },
    createdAt: '2026-05-17T09:30:00Z',
    updatedAt: '2026-05-18T02:00:00Z',
    messages: [
      {
        id: 'msg-1',
        senderId: 'opd-user',
        senderName: 'dr. Yana Yanti Suleman, SH',
        senderRole: 'OPD',
        message: 'Mohon izin berkonsultasi mengenai penempatan Sub-Kegiatan Pengadaan Alat Kesehatan (RSK) di bawah Kegiatan Penyediaan Fasyankes (RK). Apakah Cascading indikator kinerjanya sudah selaras dengan sasaran strategis di atasnya (RO-1)? Kami melampirkan draf peta rencana cascading.',
        attachments: [{ name: 'cascading_draf_dinkes.pdf', size: '1.4 MB', type: 'pdf' }],
        createdAt: '2026-05-17T09:30:00Z'
      },
      {
        id: 'msg-2',
        senderId: 'evaluator-user',
        senderName: 'Irwan Yusuf, S.Sos',
        senderRole: 'Biro Organisasi Evaluator',
        message: 'Selamat pagi Ibu Kadis Kesehatan. Kami sudah meninjau draf cascading. Secara garis besar, sub-kegiatan Pengadaan Alkes ini (1.02.02.1.01.0010) sudah terhubung dengan baik ke RK. Namun, target 40 Set itu sebaiknya dipecah berdasarkan fasyankes rujukan agar indikator output di level RO (Realisasi Kualitas Pelayanan) lebih terukur dampak perbaikannya. Silakan disesuaikan sedikit formulasi kalimat targetnya.',
        attachments: [],
        createdAt: '2026-05-17T14:45:00Z'
      },
      {
        id: 'msg-3',
        senderId: 'opd-user',
        senderName: 'dr. Yana Yanti Suleman, SH',
        senderRole: 'OPD',
        message: 'Baik Pak Irwan, kami paham masukannya. Apakah itu berarti di draf Pohon Kinerja kami perlu membuat node baru untuk rincian fasyankesnya, atau cukup diletakkan di lembar lampiran target?',
        attachments: [],
        createdAt: '2026-05-18T02:00:00Z'
      }
    ]
  },
  {
    id: 'ticket-2',
    ticketNumber: 'SAKIP-202605-0002',
    opdCode: 'DIKBUDPORA',
    opdName: 'Dinas Pendidikan dan Kebudayaan',
    title: 'Klarifikasi Indikator Sasaran Renstra Kebudayaan',
    category: 'Renstra Visi & Sasaran',
    status: 'PENDING',
    priority: 'MEDIUM',
    createdBy: 'Dr. Wahyudin Katili, S.STP, ME',
    assignedTo: null,
    sakipRef: { id: 'renstra-item-2', type: 'Sasaran Renstra', name: 'Meningkatnya pelestarian warisan budaya daerah' },
    createdAt: '2026-05-18T01:15:00Z',
    updatedAt: '2026-05-18T01:15:00Z',
    messages: [
      {
        id: 'msg-1',
        senderId: 'opd-user',
        senderName: 'Dr. Wahyudin Katili, S.STP, ME',
        senderRole: 'OPD',
        message: 'Kami ingin mengonsultasikan indikator sasaran Renstra untuk warisan budaya. Tim evaluator sebelumnya memberi catatan bahwa indikator "Jumlah komunitas budaya diberdayakan" kurang berorientasi hasil (outcome-based). Alternatif indikator outcome apa yang direkomendasikan Kemenpan RB untuk urusan kebudayaan daerah?',
        attachments: [],
        createdAt: '2026-05-18T01:15:00Z'
      }
    ]
  },
  {
    id: 'ticket-3',
    ticketNumber: 'SAKIP-202605-0003',
    opdCode: 'BAPPEDA',
    opdName: 'Bappeda',
    title: 'Konsultasi Penyusunan Laporan Kinerja Instansi Pemerintah (LKjIP)',
    category: 'Laporan SAKIP',
    status: 'RESOLVED',
    priority: 'HIGH',
    createdBy: 'Budiyanto Sidiki, S.Sos, M.Si',
    assignedTo: 'Nirwan Utiarahman, SE, MM',
    sakipRef: { id: 'lap-item-1', type: 'Laporan Triwulan I', name: 'Realisasi Fisik & Keuangan Program Pemenuhan Upaya Kesehatan' },
    createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '2026-05-16T11:20:00Z',
    rating: 5,
    feedback: 'Penjelasan sangat taktis dan solutif. Template LKjIP yang diberikan sangat membantu mempercepat penyusunan berkas kami.',
    messages: [
      {
        id: 'msg-1',
        senderId: 'opd-user',
        senderName: 'Budiyanto Sidiki, S.Sos, M.Si',
        senderRole: 'OPD',
        message: 'Bagaimana cara menyajikan analisis efisiensi anggaran di Bab III LKjIP bila terdapat penghematan anggaran yang cukup signifikan tetapi capaian kinerja fisik tetap 100%? Apakah kami perlu menjelaskan faktor eksternal secara mendalam?',
        attachments: [],
        createdAt: '2026-05-15T08:00:00Z'
      },
      {
        id: 'msg-2',
        senderId: 'evaluator-user',
        senderName: 'Nirwan Utiarahman, SE, MM',
        senderRole: 'Biro Organisasi Evaluator',
        message: 'Pak Budi, selamat siang. Ini adalah kondisi ideal yang dicari dalam SAKIP (efisiensi tinggi, kinerja maksimal). Di Bab III, Anda harus menonjolkan analisis ini sebagai "Upaya Kreatif/Inovatif Efisiensi". Silakan jelaskan metode efisiensi yang dilakukan (misalnya digitalisasi proses atau konsolidasi paket). Faktor eksternal cukup disebutkan ringkas, fokuslah pada inovasi internal Bappeda. Draf analisis efisiensi kami lampirkan di bawah.',
        attachments: [{ name: 'Template_Analisis_Efisiensi.docx', size: '256 KB', type: 'word' }],
        createdAt: '2026-05-16T10:00:00Z'
      },
      {
        id: 'msg-3',
        senderId: 'opd-user',
        senderName: 'Budiyanto Sidiki, S.Sos, M.Si',
        senderRole: 'OPD',
        message: 'Siap Pak Nirwan. Sangat mencerahkan. Konsultasi ini kami anggap selesai, kami akan langsung masukkan analisis ini ke LKjIP.',
        attachments: [],
        createdAt: '2026-05-16T11:20:00Z'
      }
    ]
  }
];

function Konsultasi({ user }) {
  useEffect(() => {
    document.title = `Konsultasi Online SAKIP | ${user?.name || 'e-SETDA'}`;
  }, [user]);

  const isAdmin = user?.role === 'ADMIN' || user?.code === 'BIRO_ORG';
  const opdCode = user?.code;

  // States
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('sakip_consultation_tickets');
    if (saved) return JSON.parse(saved);
    return INITIAL_TICKETS;
  });

  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // New ticket form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Pohon Kinerja');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [selectedSakipRef, setSelectedSakipRef] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');
  const [chatAttachments, setChatAttachments] = useState([]);
  
  // Rating states
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Ref for auto-scrolling chat
  const chatEndRef = useRef(null);

  // Save to local storage whenever tickets change
  useEffect(() => {
    localStorage.setItem('sakip_consultation_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Keep selected ticket up to date
  useEffect(() => {
    if (selectedTicket) {
      const current = tickets.find(t => t.id === selectedTicket.id);
      if (current) setSelectedTicket(current);
    }
  }, [tickets, selectedTicket?.id]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages, isTyping]);

  // Handle file uploading (simulated)
  const handleFileUpload = (e, target = 'ticket') => {
    const files = Array.from(e.target.files);
    const mapped = files.map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.split('.').pop()
    }));

    if (target === 'ticket') {
      setAttachments(prev => [...prev, ...mapped]);
    } else {
      setChatAttachments(prev => [...prev, ...mapped]);
    }
  };

  const removeAttachment = (idx, target = 'ticket') => {
    if (target === 'ticket') {
      setAttachments(prev => prev.filter((_, i) => i !== idx));
    } else {
      setChatAttachments(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Create new ticket submission
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    const refItem = SAKIP_INTEGRATION_ITEMS[newCategory]?.find(i => i.id === selectedSakipRef) || null;

    // Generate random sequential ID
    const nextNum = tickets.length + 1;
    const padNum = String(nextNum).padStart(4, '0');
    const ticketNumber = `SAKIP-202605-${padNum}`;

    const newTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber,
      opdCode: isAdmin ? 'SETDA' : opdCode,
      opdName: isAdmin ? 'Sekretariat Daerah' : user.name,
      title: newTitle,
      category: newCategory,
      status: 'PENDING',
      priority: newPriority,
      createdBy: user.name,
      assignedTo: null,
      sakipRef: refItem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'opd-user',
          senderName: user.name,
          senderRole: 'OPD',
          message: newQuestion,
          attachments: attachments,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    
    // Reset Form
    setNewTitle('');
    setNewCategory('Pohon Kinerja');
    setNewPriority('MEDIUM');
    setSelectedSakipRef('');
    setNewQuestion('');
    setAttachments([]);
    setFileInputKey(Date.now());
    setShowNewTicketModal(false);

    // Open the newly created ticket automatically
    setSelectedTicket(newTicket);
  };

  // Send a chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim() && chatAttachments.length === 0) return;

    const currentTicket = tickets.find(t => t.id === selectedTicket.id);
    if (!currentTicket) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: isAdmin ? 'evaluator-user' : 'opd-user',
      senderName: user.name,
      senderRole: isAdmin ? 'Biro Organisasi Evaluator' : 'OPD',
      message: chatMessage,
      attachments: chatAttachments,
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...currentTicket.messages, newMessage];
    
    // Update ticket state
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: isAdmin ? 'IN_PROGRESS' : t.status, // Auto move to in progress if admin replies
          updatedAt: new Date().toISOString(),
          messages: updatedMessages
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setChatMessage('');
    setChatAttachments([]);

    // Trigger AI / Evaluator Simulated Reply if user is NOT admin
    if (!isAdmin) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse = generateConsultantReply(currentTicket.category, chatMessage, currentTicket.sakipRef);
        const aiMessage = {
          id: `msg-ai-${Date.now()}`,
          senderId: 'evaluator-user',
          senderName: 'Irwan Yusuf, S.Sos',
          senderRole: 'Biro Organisasi Evaluator',
          message: aiResponse.text,
          attachments: aiResponse.attachments || [],
          createdAt: new Date().toISOString()
        };

        const updatedTicketsWithAI = tickets.map(t => {
          if (t.id === selectedTicket.id) {
            return {
              ...t,
              status: 'IN_PROGRESS',
              updatedAt: new Date().toISOString(),
              messages: [...updatedMessages, aiMessage]
            };
          }
          return t;
        });
        setTickets(updatedTicketsWithAI);
      }, 2000);
    }
  };

  // Administrative actions
  const handleAssignToMe = () => {
    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          assignedTo: `${user.name} (Biro Organisasi)`,
          status: 'IN_PROGRESS',
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    setTickets(updated);
  };

  const handleUpdateStatus = (newStatus) => {
    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    setTickets(updated);
  };

  const handleAISuggestResponse = () => {
    if (!selectedTicket) return;
    const lastUserMessage = [...selectedTicket.messages].reverse().find(m => m.senderId === 'opd-user');
    const questionText = lastUserMessage ? lastUserMessage.message : selectedTicket.title;
    
    const suggestion = generateConsultantReply(selectedTicket.category, questionText, selectedTicket.sakipRef);
    setChatMessage(suggestion.text);
  };

  // Submit Satisfactory Rating & Feedback
  const handleSubmitRating = (e) => {
    e.preventDefault();
    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'CLOSED',
          rating: ratingVal,
          feedback: ratingFeedback,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    setTickets(updated);
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingSubmitted(false);
      setRatingFeedback('');
    }, 1500);
  };

  // Generate highly authentic and smart consultant replies
  const generateConsultantReply = (category, userQuestion, sakipRef) => {
    const lowerQuestion = userQuestion.toLowerCase();
    
    if (category === 'Pohon Kinerja') {
      if (lowerQuestion.includes('sub-kegiatan') || lowerQuestion.includes('rsk')) {
        return {
          text: `Terima kasih atas tanggapan Anda. Sesuai dengan Permenpan RB No. 89 Tahun 2021 tentang Penataan Kinerja, penempatan Rencana Sub Kegiatan (RSK) memang harus menginduk penuh pada Rencana Kegiatan (RK). \n\nUntuk node ${sakipRef?.code || 'RSK'} - ${sakipRef?.name || 'Sub-Kegiatan'}, kami sarankan agar sub-kegiatan ini diformulasikan target outputnya secara spasial atau unit (misal: 'Persentase Alkes di Rumah Sakit yang Terkalibrasi 100%'). Hal ini menjamin cascading ke level RO (Rencana Operasional) di atasnya tetap selaras dan tidak terjadi putus hierarki (broken cascading).`,
          attachments: []
        };
      }
      return {
        text: `Salam hangat. Untuk menyelaraskan Pohon Kinerja OPD Anda, pastikan hubungan sebab-akibat (logical framework) dari tingkat bawah ke atas sudah solid. Yaitu:\n1. RT (Tujuan OPD) dijabarkan ke RS (Sasaran Strategis).\n2. RS dikerjakan oleh beberapa RO (Rencana Operasional).\n3. RO didukung oleh Program Kerja (RK) dan Sub-Kegiatan (RSK).\n\nKami melampirkan pedoman reviu internal cascading untuk Pemerintah Provinsi Gorontalo sebagai acuan penataan ulang pohon kinerja Anda.`,
        attachments: [{ name: 'Pedoman_Reviu_Cascading_Gorontalo_2026.pdf', size: '2.1 MB', type: 'pdf' }]
      };
    }

    if (category === 'Renstra Visi & Sasaran') {
      if (lowerQuestion.includes('outcome') || lowerQuestion.includes('indikator')) {
        return {
          text: `Halo Rekan-rekan OPD. Terkait indikator sasaran Renstra yang berorientasi hasil (outcome), Kemenpan RB sangat menekankan pengunaan indikator yang mengukur kebermanfaatan nyata, bukan sekadar jumlah aktivitas. \n\nSebagai contoh, untuk urusan kebudayaan, dari pada menggunakan 'Jumlah komunitas yang dibina' (yang masih level output), ubahlah menjadi outcome seperti:\n- 'Indeks Pelestarian Warisan Budaya Daerah' atau \n- 'Persentase Warisan Budaya yang Berstatus Aktif Dilestarikan'. \n\nHal ini akan meningkatkan kualitas Nilai SAKIP Provinsi Gorontalo karena indikator kinerjanya mencerminkan dampak (impact).`,
          attachments: []
        };
      }
    }

    if (category === 'Laporan SAKIP') {
      return {
        text: `Terima kasih atas pertanyaannya. LKjIP (Laporan Kinerja Instansi Pemerintah) yang berkualitas wajib menyajikan analisis efisiensi. Cara menghitungnya adalah dengan membandingkan persentase realisasi kinerja fisik terhadap persentase realisasi anggaran. \n\nRumus Efisiensi = (1 - (Realisasi Anggaran % / Realisasi Kinerja Fisik %)) x 100% \n\nBila efisiensi positif, sajikan penjelasan bahwa ini diperoleh melalui strategi inovasi internal (misal: efisiensi metode kerja atau pemangkasan birokrasi), bukan karena pembatalan kegiatan.`,
        attachments: []
      };
    }

    // Default response
    return {
      text: `Terima kasih atas konsultasi Anda mengenai ${category}. Tim Evaluator SAKIP Biro Organisasi Provinsi Gorontalo telah menerima pesan ini. Kami merekomendasikan agar Anda melakukan pengisian draf SAKIP secara lengkap dan menautkannya dengan Pohon Kinerja OPD agar kami dapat melakukan analisis dokumen yang komprehensif.`,
      attachments: []
    };
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    // Role based visibility
    if (!isAdmin && ticket.opdCode !== opdCode) return false;

    // Tab based category filtering
    if (activeTab !== 'Semua' && ticket.category !== activeTab) return false;

    // Search query filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ticket.title.toLowerCase().includes(q);
      const matchNum = ticket.ticketNumber.toLowerCase().includes(q);
      const matchOpd = ticket.opdName.toLowerCase().includes(q);
      return matchTitle || matchNum || matchOpd;
    }

    return true;
  });

  // Calculate statistics
  const totalCount = isAdmin ? tickets.length : tickets.filter(t => t.opdCode === opdCode).length;
  const pendingCount = (isAdmin ? tickets : tickets.filter(t => t.opdCode === opdCode)).filter(t => t.status === 'PENDING').length;
  const activeCount = (isAdmin ? tickets : tickets.filter(t => t.opdCode === opdCode)).filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = (isAdmin ? tickets : tickets.filter(t => t.opdCode === opdCode)).filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className="konsultasi-page">
      {/* Header Banner */}
      <div className="page-header-simple glass no-print">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>Konsultasi Online SAKIP</span>
        </div>
        <div className="period-badge">OPD Provinsi Gorontalo &bull; Biro Organisasi</div>
      </div>

      {/* Premium Statistics Row */}
      <div className="stats-row">
        <div className="c-stat-card card">
          <div className="c-stat-icon pending"><Clock size={20} /></div>
          <div className="c-stat-info">
            <span className="c-stat-val">{pendingCount}</span>
            <span className="c-stat-label">Menunggu Respon</span>
          </div>
        </div>
        <div className="c-stat-card card">
          <div className="c-stat-icon active"><MessageSquare size={20} /></div>
          <div className="c-stat-info">
            <span className="c-stat-val">{activeCount}</span>
            <span className="c-stat-label">Konsultasi Aktif</span>
          </div>
        </div>
        <div className="c-stat-card card">
          <div className="c-stat-icon resolved"><CheckCircle2 size={20} /></div>
          <div className="c-stat-info">
            <span className="c-stat-val">{resolvedCount}</span>
            <span className="c-stat-label">Selesai / Terjawab</span>
          </div>
        </div>
        <div className="c-stat-card card total-card">
          <div className="c-stat-icon total"><Inbox size={20} /></div>
          <div className="c-stat-info">
            <span className="c-stat-val">{totalCount}</span>
            <span className="c-stat-label">Total Tiket Saya</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-konsultasi-grid">
        {/* Left Column: Tickets List */}
        <div className="tickets-sidebar card">
          <div className="sidebar-header-row">
            <h3>Daftar Konsultasi</h3>
            {!isAdmin && (
              <button 
                onClick={() => setShowNewTicketModal(true)} 
                className="btn btn-primary btn-sm-custom"
              >
                <PlusCircle size={16} /> Konsultasi Baru
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari tiket, nomor, atau OPD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Quick Filter Tabs */}
          <div className="category-scroll-tabs">
            {['Semua', 'Pohon Kinerja', 'Perjanjian Kinerja', 'Renstra Visi & Sasaran', 'Laporan SAKIP', 'Kamus Indikator'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`category-tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tickets List */}
          <div className="tickets-list-container">
            {filteredTickets.length === 0 ? (
              <div className="empty-state">
                <Inbox size={48} className="text-muted mb-2" />
                <p>Tidak ada tiket konsultasi ditemukan.</p>
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`ticket-item-row ${selectedTicket?.id === ticket.id ? 'active' : ''} ${ticket.priority === 'HIGH' ? 'priority-high-border' : ''}`}
                >
                  <div className="ticket-item-header">
                    <span className="ticket-num">{ticket.ticketNumber}</span>
                    <span className={`c-badge ${ticket.status.toLowerCase()}`}>
                      {ticket.status === 'PENDING' ? 'Baru' : ticket.status === 'IN_PROGRESS' ? 'Berjalan' : ticket.status === 'RESOLVED' ? 'Terjawab' : 'Selesai'}
                    </span>
                  </div>
                  <h4 className="ticket-title">{ticket.title}</h4>
                  <div className="ticket-meta-info">
                    <span className="category-tag">{ticket.category}</span>
                    {isAdmin && <span className="opd-tag">{ticket.opdName}</span>}
                  </div>
                  
                  {ticket.sakipRef && (
                    <div className="linked-sakip-tag">
                      <GitBranch size={12} /> {ticket.sakipRef.code || ticket.sakipRef.type}: {ticket.sakipRef.name.substring(0, 45)}...
                    </div>
                  )}

                  <div className="ticket-item-footer">
                    <span className="ticket-time">Update: {new Date(ticket.updatedAt).toLocaleDateString('id-ID')}</span>
                    {ticket.priority === 'HIGH' && <span className="priority-high-badge">PENTING</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Chat/Discussion details */}
        <div className="chat-panel card">
          {selectedTicket ? (
            <div className="chat-layout-container">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="ticket-badge-row">
                    <span className="chat-ticket-num">{selectedTicket.ticketNumber}</span>
                    <span className="chat-category-badge">{selectedTicket.category}</span>
                    <span className={`c-badge ${selectedTicket.status.toLowerCase()}`}>
                      {selectedTicket.status === 'PENDING' ? 'Baru' : selectedTicket.status === 'IN_PROGRESS' ? 'Berjalan' : selectedTicket.status === 'RESOLVED' ? 'Terjawab' : 'Selesai'}
                    </span>
                  </div>
                  <h2>{selectedTicket.title}</h2>
                  <p className="chat-subtitle">
                    Dibuat oleh: <strong>{selectedTicket.createdBy} ({selectedTicket.opdCode})</strong> &bull; Pendamping: <strong>{selectedTicket.assignedTo || 'Belum Ditugaskan'}</strong>
                  </p>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="admin-actions-bar">
                    {!selectedTicket.assignedTo && (
                      <button onClick={handleAssignToMe} className="btn btn-outline btn-sm-custom">
                        <UserCheck size={16} /> Dampingi OPD Ini
                      </button>
                    )}
                    <div className="status-dropdown-wrapper">
                      <select 
                        value={selectedTicket.status} 
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="status-select-admin"
                      >
                        <option value="PENDING">Status: Baru (Pending)</option>
                        <option value="IN_PROGRESS">Status: Berjalan (In Progress)</option>
                        <option value="RESOLVED">Status: Terjawab (Resolved)</option>
                        <option value="CLOSED">Status: Selesai & Tutup (Closed)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Body & Split Sidebar Layout */}
              <div className="chat-body-split">
                {/* Chat Messages Stream */}
                <div className="chat-messages-stream">
                  <div className="messages-scroll-area">
                    {selectedTicket.messages.map((msg, i) => (
                      <div 
                        key={msg.id || i}
                        className={`message-bubble-wrapper ${msg.senderId === (isAdmin ? 'evaluator-user' : 'opd-user') ? 'own-message' : 'other-message'}`}
                      >
                        <div className="message-header-meta">
                          <span className="msg-sender-name">{msg.senderName}</span>
                          <span className="msg-sender-role">{msg.senderRole}</span>
                        </div>
                        
                        <div className="message-text-bubble">
                          <p>{msg.message}</p>
                          
                          {/* Attachments inside message */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="message-attachments-list">
                              {msg.attachments.map((file, fIdx) => (
                                <a 
                                  href="#" 
                                  onClick={(e) => { e.preventDefault(); alert(`Simulasi Mengunduh File: ${file.name}`); }}
                                  key={fIdx} 
                                  className="msg-attachment-item"
                                >
                                  <FileText size={16} />
                                  <div className="attachment-details">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">{file.size}</span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="message-timestamp">
                          {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}

                    {/* Satisfactory Rating Display inside Chat Feed when Resolved */}
                    {(selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED') && (
                      <div className="rating-survey-container card">
                        {selectedTicket.status === 'RESOLVED' && !isAdmin ? (
                          <form onSubmit={handleSubmitRating} className="rating-form-feed">
                            <div className="survey-header">
                              <Sparkles size={20} className="text-secondary" />
                              <h4>Evaluasi Kepuasan Pelayanan Konsultasi SAKIP</h4>
                            </div>
                            <p>Biro Organisasi Provinsi Gorontalo berkomitmen meningkatkan kualitas pendampingan E SAKIP. Silakan berikan penilaian Anda:</p>
                            
                            <div className="rating-stars-row">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setRatingVal(star)}
                                  className={`star-btn ${ratingVal >= star ? 'filled' : ''}`}
                                >
                                  <Star size={32} />
                                </button>
                              ))}
                            </div>

                            <textarea
                              placeholder="Masukkan umpan balik/saran perbaikan Anda..."
                              value={ratingFeedback}
                              onChange={(e) => setRatingFeedback(e.target.value)}
                              rows={2}
                              required
                            />

                            <button type="submit" className="btn btn-primary w-full mt-2">
                              Kirim Penilaian & Tutup Konsultasi <CheckCircle2 size={16} />
                            </button>
                          </form>
                        ) : (
                          <div className="rating-result-feed">
                            <div className="survey-header">
                              <CheckCircle2 size={20} className="text-success" />
                              <h4>Konsultasi Selesai & Dinilai</h4>
                            </div>
                            <div className="stars-display">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  size={18} 
                                  className={selectedTicket.rating >= s ? 'text-accent-fill' : 'text-star-empty'} 
                                />
                              ))}
                            </div>
                            <p className="feedback-text">
                              &ldquo;{selectedTicket.feedback || 'Sangat puas dengan pelayanan Biro Organisasi.'}&rdquo;
                            </p>
                            <span className="closed-stamp">Ditutup pada {new Date(selectedTicket.updatedAt).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Typing Simulator */}
                    {isTyping && (
                      <div className="message-bubble-wrapper other-message">
                        <div className="message-header-meta">
                          <span className="msg-sender-name">Biro Organisasi</span>
                          <span className="msg-sender-role">Mengetik...</span>
                        </div>
                        <div className="typing-indicator-bubble">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input Bar */}
                  {selectedTicket.status !== 'CLOSED' && selectedTicket.status !== 'RESOLVED' && (
                    <form onSubmit={handleSendMessage} className="chat-input-form">
                      {chatAttachments.length > 0 && (
                        <div className="chat-attachments-preview-row">
                          {chatAttachments.map((f, i) => (
                            <div key={i} className="preview-chip">
                              <FileText size={14} />
                              <span>{f.name.substring(0, 15)}...</span>
                              <button type="button" onClick={() => removeAttachment(i, 'chat')} className="delete-chip">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="chat-input-inner">
                        {/* Simulated Attachment Trigger */}
                        <label className="chat-action-btn attach-btn">
                          <Paperclip size={20} />
                          <input 
                            type="file" 
                            multiple 
                            onChange={(e) => handleFileUpload(e, 'chat')} 
                            style={{ display: 'none' }} 
                          />
                        </label>

                        <input 
                          type="text" 
                          placeholder="Ketik pertanyaan atau tanggapan konsultasi Anda..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                        />

                        {/* Admin Smart Policy Suggestion Button */}
                        {isAdmin && (
                          <button 
                            type="button" 
                            title="Draf Jawaban dengan AI Evaluator"
                            onClick={handleAISuggestResponse}
                            className="chat-action-btn ai-draft-btn"
                          >
                            <Sparkles size={20} />
                          </button>
                        )}

                        <button type="submit" className="send-message-btn">
                          <Send size={18} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right Split Sidebar: SAKIP Component Integration Ref Card */}
                {selectedTicket.sakipRef && (
                  <div className="chat-split-sidebar">
                    <div className="sidebar-title">
                      <Target size={18} className="text-secondary" />
                      <h4>Komponen Terintegrasi</h4>
                    </div>

                    <div className="sakip-ref-card-visual">
                      <div className="ref-card-header">
                        <span className={`ref-type-badge ${selectedTicket.sakipRef.type?.toLowerCase() || 'rsk'}`}>
                          {selectedTicket.sakipRef.type || 'Pohon Kinerja'}
                        </span>
                        {selectedTicket.sakipRef.code && (
                          <span className="ref-code">{selectedTicket.sakipRef.code}</span>
                        )}
                      </div>
                      
                      <p className="ref-name">{selectedTicket.sakipRef.name}</p>

                      <div className="ref-meta-metrics">
                        {selectedTicket.sakipRef.target && (
                          <div className="ref-metric-box">
                            <span className="metric-lbl">Target Kinerja</span>
                            <span className="metric-val">{selectedTicket.sakipRef.target}</span>
                          </div>
                        )}
                        {selectedTicket.sakipRef.budget && (
                          <div className="ref-metric-box">
                            <span className="metric-lbl">Pagu Anggaran</span>
                            <span className="metric-val budget-green">{selectedTicket.sakipRef.budget}</span>
                          </div>
                        )}
                        {selectedTicket.sakipRef.formula && (
                          <div className="ref-metric-box w-full-metric">
                            <span className="metric-lbl">Formulasi Pengukuran</span>
                            <code className="metric-val formula-code">{selectedTicket.sakipRef.formula}</code>
                          </div>
                        )}
                      </div>

                      <div className="ref-card-footer">
                        <p className="ref-desc">
                          Tiket ini terhubung dengan pohon kinerja OPD. Evaluasi penyelarasan cascading dilakukan otomatis berdasarkan Kemenpan RB guidelines.
                        </p>
                        <button 
                          onClick={() => window.location.href='/pohon-kinerja'} 
                          className="btn btn-outline w-full btn-sm-custom mt-2"
                        >
                          <GitBranch size={14} /> Buka di Pohon Kinerja
                        </button>
                      </div>
                    </div>

                    {/* SAKIP Policy Reference Quick Notes */}
                    <div className="quick-notes-container">
                      <h5>Pedoman SAKIP Terkait:</h5>
                      <ul>
                        <li>Pastikan cascading target bersifat *logic-causality* (sebab-akibat).</li>
                        <li>Indikator di level sub-kegiatan (RSK) wajib bertipe *output/outcome antara*.</li>
                        <li>Batas pengumpulan Perjanjian Kinerja (PK) triwulan berjalan adalah H+15.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-chat-selected">
              <MessageSquare size={64} className="text-muted mb-4" />
              <h3>Selamat Datang di Portal Konsultasi Online SAKIP</h3>
              <p>Pilih salah satu tiket di sebelah kiri untuk melihat rincian konsultasi dan riwayat pesan, atau buat konsultasi baru untuk menanyakan keselarasan Pohon Kinerja, Sasaran Renstra, dan indikator SAKIP OPD Anda dengan pendamping dari Biro Organisasi Provinsi Gorontalo.</p>
              
              {!isAdmin && (
                <button 
                  onClick={() => setShowNewTicketModal(true)} 
                  className="btn btn-primary mt-4"
                >
                  <PlusCircle size={18} /> Mulai Konsultasi Sekarang
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE NEW TICKETS */}
      {showNewTicketModal && (
        <div className="modal-backdrop no-print">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content-card card"
          >
            <div className="modal-header-row">
              <h3>Mulai Konsultasi Online SAKIP</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="close-modal-btn">X</button>
            </div>

            <form onSubmit={handleCreateTicket} className="modal-form-body">
              <div className="form-group-custom">
                <label>Judul Masalah / Pertanyaan</label>
                <input 
                  type="text" 
                  placeholder="Misal: Keselarasan Indikator RO-1 dengan Kegiatan Dinas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group-custom">
                  <label>Kategori SAKIP</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => { setNewCategory(e.target.value); setSelectedSakipRef(''); }}
                  >
                    <option value="Pohon Kinerja">Pohon Kinerja (Cascading)</option>
                    <option value="Perjanjian Kinerja">Perjanjian Kinerja (PK)</option>
                    <option value="Renstra Visi & Sasaran">Visi & Sasaran Renstra</option>
                    <option value="Laporan SAKIP">Laporan SAKIP & LKjIP</option>
                    <option value="Kamus Indikator">Kamus Indikator Utama (IKU)</option>
                  </select>
                </div>

                <div className="form-group-custom">
                  <label>Prioritas</label>
                  <select 
                    value={newPriority} 
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="LOW">Rendah (Low)</option>
                    <option value="MEDIUM">Sedang (Medium)</option>
                    <option value="HIGH">Tinggi (High)</option>
                  </select>
                </div>
              </div>

              {/* SAKIP Integration Ref Dropdown */}
              {SAKIP_INTEGRATION_ITEMS[newCategory] && (
                <div className="form-group-custom highlight-select-box">
                  <div className="label-with-icon">
                    <GitBranch size={14} className="text-secondary" />
                    <label>Tautkan dengan Komponen SAKIP OPD Anda</label>
                  </div>
                  <select 
                    value={selectedSakipRef}
                    onChange={(e) => setSelectedSakipRef(e.target.value)}
                  >
                    <option value="">-- Pilih Elemen SAKIP yang ingin Dikonsultasikan --</option>
                    {SAKIP_INTEGRATION_ITEMS[newCategory].map(item => (
                      <option key={item.id} value={item.id}>
                        [{item.code || item.type}] {item.name.substring(0, 70)}...
                      </option>
                    ))}
                  </select>
                  <p className="form-helper-text">Menautkan elemen SAKIP membantu Biro Organisasi melakukan pendampingan secara presisi.</p>
                </div>
              )}

              <div className="form-group-custom">
                <label>Jelaskan Pertanyaan Anda secara Detail</label>
                <textarea
                  placeholder="Tuliskan kendala, kebingungan, atau klarifikasi yang Anda perlukan secara lengkap..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Attachment Section */}
              <div className="form-group-custom">
                <label>Lampiran Berkas (Draf/Dokumen)</label>
                <div className="simulated-uploader-box">
                  <input 
                    type="file" 
                    key={fileInputKey}
                    multiple 
                    onChange={(e) => handleFileUpload(e, 'ticket')} 
                    id="modal-file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="modal-file-input" className="uploader-trigger-lbl">
                    <Paperclip size={18} />
                    <span>Pilih Berkas Pendukung (PDF, Word, Excel, Gambar)</span>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="attachments-preview-list mt-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="attachment-chip">
                        <FileText size={14} className="text-secondary" />
                        <div className="chip-details">
                          <span className="c-name">{file.name}</span>
                          <span className="c-size">{file.size}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeAttachment(idx, 'ticket')} 
                          className="delete-chip-btn"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer-btns">
                <button type="button" onClick={() => setShowNewTicketModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Draf Konsultasi <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* STYLES FOR THE ENTIRE PORTAL */}
      <style dangerouslySetInnerHTML={{ __html: `
        .konsultasi-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: 100%;
        }

        .btn-sm-custom {
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .c-stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem var(--spacing-lg) !important;
        }

        .c-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .c-stat-icon.pending { background: #fee2e2; color: #ef4444; }
        .c-stat-icon.active { background: #eff6ff; color: #2563eb; }
        .c-stat-icon.resolved { background: #dcfce7; color: #166534; }
        .c-stat-icon.total { background: #f1f5f9; color: #475569; }

        .c-stat-val {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1.2;
        }

        .c-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .total-card {
          background: linear-gradient(135deg, #1e293b, #0f172a) !important;
          border-color: #334155 !important;
          color: white !important;
        }
        .total-card .c-stat-val { color: white; }
        .total-card .c-stat-label { color: rgba(255, 255, 255, 0.6); }
        .total-card .c-stat-icon.total { background: rgba(255,255,255,0.1); color: white; }

        /* Main Grid layout */
        .main-konsultasi-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.5rem;
          height: calc(100vh - 280px);
          min-height: 550px;
        }

        /* Sidebar tickets list */
        .tickets-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: var(--spacing-md) !important;
          overflow: hidden;
        }

        .sidebar-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sidebar-header-row h3 {
          font-weight: 700;
          color: var(--primary);
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }
        .search-wrapper input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          border-radius: var(--radius-md);
          border: 1px solid #cbd5e1;
          font-size: 0.9rem;
          background: #f8fafc;
        }
        .search-wrapper input:focus {
          outline: none;
          border-color: var(--secondary);
          background: white;
        }

        .category-scroll-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 4px;
          border-bottom: 1px solid #f1f5f9;
        }
        .category-scroll-tabs::-webkit-scrollbar { height: 4px; }
        .category-scroll-tabs::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        .category-tab-btn {
          white-space: nowrap;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          background: #f1f5f9;
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }
        .category-tab-btn:hover { background: #e2e8f0; color: var(--primary); }
        .category-tab-btn.active {
          background: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
        }

        .tickets-list-container {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 2px;
        }
        .tickets-list-container::-webkit-scrollbar { width: 6px; }
        .tickets-list-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .ticket-item-row {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .ticket-item-row:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateX(2px);
        }
        .ticket-item-row.active {
          background: #f0fdf4;
          border-color: #86efac;
          box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.08);
        }

        .priority-high-border {
          border-left: 4px solid #ef4444 !important;
        }

        .ticket-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ticket-num {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          font-family: monospace;
        }

        .c-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .c-badge.pending { background: #fee2e2; color: #ef4444; }
        .c-badge.in_progress { background: #dbeafe; color: #2563eb; }
        .c-badge.resolved { background: #e0f2fe; color: #0369a1; }
        .c-badge.closed { background: #dcfce7; color: #166534; }

        .ticket-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.4;
          margin: 2px 0;
        }

        .ticket-meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .category-tag {
          font-size: 0.65rem;
          font-weight: 600;
          color: #475569;
          background: #e2e8f0;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .opd-tag {
          font-size: 0.65rem;
          font-weight: 600;
          color: #1e3a8a;
          background: #eff6ff;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .linked-sakip-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          color: #166534;
          background: #f0fdf4;
          padding: 3px 6px;
          border-radius: 4px;
          margin-top: 2px;
          font-weight: 600;
        }

        .ticket-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
        }
        .priority-high-badge {
          background: #fee2e2;
          color: #ef4444;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 0.6rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        /* Right Column Chat Panel */
        .chat-panel {
          padding: 0 !important;
          overflow: hidden;
        }

        .no-chat-selected {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .no-chat-selected h3 {
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .no-chat-selected p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .chat-layout-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }
        .chat-header-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ticket-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chat-ticket-num {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-muted);
        }
        .chat-category-badge {
          background: #cbd5e1;
          color: var(--primary);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .chat-header h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
        }
        .chat-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .admin-actions-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-select-admin {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid #cbd5e1;
          font-size: 0.8rem;
          font-weight: 700;
          background: white;
          color: var(--primary);
          outline: none;
        }
        .status-select-admin:focus { border-color: var(--secondary); }

        /* Split body layout */
        .chat-body-split {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 300px;
          overflow: hidden;
        }

        .chat-messages-stream {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e2e8f0;
          height: 100%;
          overflow: hidden;
        }

        .messages-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #fafcfb;
        }
        .messages-scroll-area::-webkit-scrollbar { width: 6px; }
        .messages-scroll-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .message-bubble-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 75%;
        }

        .message-bubble-wrapper.own-message {
          align-self: flex-end;
          align-items: flex-end;
        }

        .message-bubble-wrapper.other-message {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-header-meta {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: 2px;
          display: flex;
          gap: 6px;
          font-weight: 700;
        }
        .msg-sender-role {
          background: rgba(0,0,0,0.05);
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 0.65rem;
        }
        .own-message .msg-sender-role {
          background: rgba(22, 101, 52, 0.1);
          color: var(--secondary);
        }

        .message-text-bubble {
          padding: 0.95rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.5;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          white-space: pre-line;
        }

        .own-message .message-text-bubble {
          background: var(--secondary);
          color: white;
          border-bottom-right-radius: 2px;
        }

        .other-message .message-text-bubble {
          background: white;
          color: var(--text-main);
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 2px;
        }

        .message-timestamp {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
        }

        /* Chat Attachments inside messages */
        .message-attachments-list {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 8px;
        }
        .other-message .message-attachments-list {
          border-top-color: #f1f5f9;
        }

        .msg-attachment-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .own-message .msg-attachment-item {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        .own-message .msg-attachment-item:hover { background: rgba(255, 255, 255, 0.25); }

        .other-message .msg-attachment-item {
          background: #f1f5f9;
          color: var(--primary);
        }
        .other-message .msg-attachment-item:hover { background: #e2e8f0; }

        .attachment-details {
          display: flex;
          flex-direction: column;
        }
        .file-size { font-size: 0.65rem; opacity: 0.7; }

        /* Rating container */
        .rating-survey-container {
          background: white !important;
          border: 1px solid #bbf7d0 !important;
          padding: var(--spacing-lg) !important;
          align-self: center;
          width: 90%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
          margin: 1rem 0;
        }
        .survey-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.5rem;
        }
        .survey-header h4 {
          font-weight: 800;
          color: var(--primary);
        }
        .rating-survey-container p {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .rating-stars-row {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .star-btn {
          color: #cbd5e1;
          transition: all 0.2s;
        }
        .star-btn.filled { color: #f59e0b; }
        .star-btn:hover { transform: scale(1.15); }

        .rating-form-feed textarea {
          width: 100%;
          border-radius: var(--radius-md);
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          font-size: 0.85rem;
          outline: none;
        }
        .rating-form-feed textarea:focus { border-color: var(--secondary); }

        .rating-result-feed {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .stars-display {
          display: flex;
          gap: 4px;
          margin-bottom: 0.5rem;
        }
        .text-accent-fill { color: #f59e0b; fill: #f59e0b; }
        .text-star-empty { color: #cbd5e1; }
        .feedback-text {
          font-style: italic;
          font-weight: 600;
          color: var(--primary) !important;
          font-size: 0.88rem !important;
          margin-bottom: 0.5rem;
        }
        .closed-stamp {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        /* Typing Indicator dots */
        .typing-indicator-bubble {
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 12px;
          border-bottom-left-radius: 2px;
        }
        .typing-indicator-bubble .dot {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.3s infinite ease-in-out;
        }
        .typing-indicator-bubble .dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-indicator-bubble .dot:nth-child(3) { animation-delay: 0.3s; }
        
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        /* Chat input form */
        .chat-input-form {
          padding: 1rem 2rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: white;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .chat-attachments-preview-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-bottom: 8px;
        }
        
        .preview-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 2px 8px;
          border-radius: var(--radius-md);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--primary);
        }
        .delete-chip {
          color: var(--error);
          display: flex;
          align-items: center;
          margin-left: 2px;
        }

        .chat-input-inner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 4px 6px;
        }
        .chat-input-inner input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.6rem 0.5rem;
          font-size: 0.9rem;
          color: var(--text-main);
          outline: none;
        }
        
        .chat-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .chat-action-btn:hover { background: #e2e8f0; color: var(--primary); }
        .ai-draft-btn { color: #7c3aed; background: #f5f3ff; }
        .ai-draft-btn:hover { background: #ddd6fe; color: #4c1d95; }

        .send-message-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--secondary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .send-message-btn:hover { background: var(--secondary-light); }

        /* Split Sidebar details card */
        .chat-split-sidebar {
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #f8fafc;
        }
        .chat-split-sidebar::-webkit-scrollbar { width: 4px; }
        .chat-split-sidebar::-webkit-scrollbar-thumb { background: #cbd5e1; }

        .chat-split-sidebar .sidebar-title {
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .chat-split-sidebar .sidebar-title h4 {
          font-weight: 700;
          color: var(--primary);
        }

        .sakip-ref-card-visual {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ref-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ref-type-badge {
          font-size: 0.6rem;
          font-weight: 900;
          color: white;
          padding: 1px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .ref-type-badge.rt { background: #0d9488; }
        .ref-type-badge.rs { background: #0284c7; }
        .ref-type-badge.ro { background: #db2777; }
        .ref-type-badge.rk { background: #475569; }
        .ref-type-badge.rsk { background: #ec4899; }
        
        .ref-code {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .ref-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.4;
        }

        .ref-meta-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .ref-metric-box {
          flex: 1;
          min-width: 100px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }
        .w-full-metric { width: 100%; flex: auto; }
        .metric-lbl {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        .metric-val {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary);
        }
        .budget-green { color: #166534; }
        .formula-code {
          font-family: monospace;
          font-size: 0.65rem;
          background: #f1f5f9;
          padding: 2px 4px;
          border-radius: 4px;
          margin-top: 2px;
          line-height: 1.2;
        }

        .ref-card-footer {
          border-top: 1px dashed #e2e8f0;
          padding-top: 0.5rem;
          margin-top: 4px;
        }
        .ref-desc {
          font-size: 0.68rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .quick-notes-container {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 10px;
          padding: 1rem;
        }
        .quick-notes-container h5 {
          font-weight: 700;
          color: #78350f;
          font-size: 0.78rem;
          margin-bottom: 4px;
        }
        .quick-notes-container ul {
          padding-left: 1rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .quick-notes-container li {
          font-size: 0.68rem;
          color: #92400e;
          font-weight: 500;
          line-height: 1.3;
        }

        /* MODAL FOR NEW TICKETS */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }

        .modal-content-card {
          width: 600px;
          max-width: 95%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem !important;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.75rem;
        }
        .modal-header-row h3 {
          font-weight: 800;
          color: var(--primary);
        }
        .close-modal-btn {
          font-weight: 800;
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        .close-modal-btn:hover { color: var(--error); }

        .modal-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group-custom {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-group-custom label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
        }
        .form-group-custom input, 
        .form-group-custom select, 
        .form-group-custom textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 0.65rem 0.875rem;
          font-size: 0.9rem;
          outline: none;
          background: #f8fafc;
        }
        .form-group-custom input:focus, 
        .form-group-custom select:focus, 
        .form-group-custom textarea:focus {
          border-color: var(--secondary);
          background: white;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .highlight-select-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 12px;
          border-radius: var(--radius-lg);
        }
        .label-with-icon {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .label-with-icon label { margin-bottom: 0; }
        
        .form-helper-text {
          font-size: 0.68rem;
          color: #166534;
          font-weight: 600;
          margin-top: 2px;
        }

        .simulated-uploader-box {
          border: 2px dashed #cbd5e1;
          border-radius: var(--radius-md);
          background: #f8fafc;
          padding: 1.25rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .simulated-uploader-box:hover { border-color: var(--secondary); }
        .uploader-trigger-lbl {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .attachments-preview-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .attachment-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e2e8f0;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          max-width: 250px;
        }
        .chip-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .c-name { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .c-size { font-size: 0.6rem; color: var(--text-muted); }
        .delete-chip-btn {
          font-weight: 800;
          color: var(--error);
          margin-left: auto;
          font-size: 0.8rem;
          padding: 2px;
        }

        .modal-footer-btns {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 1024px) {
          .main-konsultasi-grid {
            grid-template-columns: 1fr;
            height: auto;
          }
          .chat-body-split {
            grid-template-columns: 1fr;
          }
          .chat-split-sidebar {
            border-top: 1px solid #e2e8f0;
            max-height: 400px;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
          .modal-content-card {
            padding: 1.25rem !important;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}

export default Konsultasi;
