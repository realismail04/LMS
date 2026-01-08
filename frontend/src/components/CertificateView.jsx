import { FaCertificate, FaDownload, FaShareAlt, FaCheckCircle, FaGraduationCap } from 'react-icons/fa';

const CertificateView = ({ user, course, certificateId, issuedAt }) => {
    return (
        <div className="max-w-4xl mx-auto my-12 animate-fade-up">
            <div className="bg-white p-1 pb-2 rounded-[40px] shadow-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white rounded-[38px] p-12 md:p-20 relative overflow-hidden border-8 border-gray-50">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full -ml-32 -mb-32 opacity-50" />

                    {/* Watermark Logo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-12 scale-150 grayscale">
                        <FaGraduationCap size={400} />
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <FaGraduationCap size={40} />
                            </div>
                        </div>

                        <span className="text-xs font-black tracking-[0.5em] text-indigo-600 uppercase mb-6 block">Verification of Achievement</span>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic leading-[0.9]">
                            Certificate of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Completion</span>
                        </h1>

                        <p className="text-lg text-gray-400 font-bold mb-12 uppercase tracking-widest">This is to certify that</p>

                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 border-b-4 border-gray-100 inline-block px-12 pb-4">
                            {user?.name || 'Academic Scholar'}
                        </h2>

                        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
                            has successfully synchronized all required knowledge nodes and demonstrated mastery in the curriculum for
                            <br />
                            <span className="text-gray-900 font-black uppercase italic tracking-tight text-2xl mt-4 block underline decoration-indigo-200 underline-offset-8">
                                {course?.title || 'Advanced Intelligence Systems'}
                            </span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end pt-12 border-t border-gray-100">
                            <div className="text-left">
                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Issue Date</div>
                                <div className="text-sm font-bold text-gray-900">{issuedAt ? new Date(issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full border-4 border-white shadow-inner flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full border-t-indigo-500 animate-[spin_5s_linear_infinite]" />
                                    <FaCheckCircle className="text-indigo-500 text-4xl" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Certificate ID</div>
                                <div className="text-sm font-mono font-bold text-gray-900 uppercase tracking-tighter">{certificateId || 'CERT-HAXO-777'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
                <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                    <FaDownload /> Download PDF
                </button>
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
                    <FaShareAlt /> Share Achievement
                </button>
            </div>
        </div>
    );
};

export default CertificateView;
