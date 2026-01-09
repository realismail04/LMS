import React from 'react';
import { Typography, Button, Space, Row, Col, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaArrowRight, FaPlay, FaUsers, FaRocket, FaChalkboardTeacher } from 'react-icons/fa';

const { Title, Paragraph, Text } = Typography;

const HomeHero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-32 overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 min-h-[90vh] flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl"
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} lg={14}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-bold mb-8 shadow-2xl">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <FaRocket className="text-indigo-300" />
                                <span className="uppercase tracking-widest text-[10px] sm:text-xs">The Future of Digital Education</span>
                            </div>

                            <Title className="!text-white !text-6xl sm:!text-7xl lg:!text-8xl !font-black !leading-[0.95] !mb-8 !tracking-tighter">
                                Master Skills That <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                                    Shape Futures.
                                </span>
                            </Title>

                            <Paragraph className="!text-xl sm:!text-2xl !text-gray-300 !mb-12 !max-w-2xl !leading-relaxed !font-medium">
                                Join <Text className="!text-white !font-bold">150K+ ambitious learners</Text> today. Industry-recognized certificates, expert-led paths, and a community that grows with you.
                            </Paragraph>

                            <div className="flex flex-wrap gap-5 items-center mb-16">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<FaArrowRight />}
                                    className="!h-16 !px-10 !rounded-2xl !bg-gradient-to-r !from-indigo-600 !to-purple-600 !border-none !text-lg !font-bold !flex !flex-row-reverse !items-center !gap-3 hover:!shadow-2xl hover:!shadow-indigo-500/50 transition-all"
                                    onClick={() => navigate('/courses')}
                                >
                                    Start Learning Free
                                </Button>

                                <Button
                                    ghost
                                    size="large"
                                    icon={<FaPlay />}
                                    className="!h-16 !px-10 !rounded-2xl !border-white/20 !text-white !text-lg !font-bold hover:!bg-white/10 transition-all flex items-center gap-3"
                                >
                                    Watch Demo
                                </Button>
                            </div>

                            <Row gutter={[32, 32]}>
                                {[
                                    { label: 'Learners', value: '150K+', icon: <FaUsers /> },
                                    { label: 'Courses', value: '1.2K+', icon: <FaGraduationCap /> },
                                    { label: 'Instructors', value: '450+', icon: <FaChalkboardTeacher /> }
                                ].map((stat, i) => (
                                    <Col key={i}>
                                        <div className="flex flex-col">
                                            <Text className="!text-3xl !font-black !text-white !mb-1">{stat.value}</Text>
                                            <Text className="!text-xs !text-gray-400 !uppercase !tracking-widest !font-bold">{stat.label}</Text>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={10} className="hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Main Image Card */}
                            <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-4 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Learning Experience"
                                    className="w-full h-auto rounded-[32px] grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                                />

                                {/* Floating Badge 1 */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <FaGraduationCap size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-gray-900 leading-none">Verified</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Certificates</div>
                                    </div>
                                </motion.div>

                                {/* Floating Badge 2 */}
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -top-6 -right-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 shadow-2xl"
                                >
                                    <div className="text-white font-black text-2xl leading-none">4.9/5</div>
                                    <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Student Rating</div>
                                </motion.div>
                            </div>

                            {/* Background Glows */}
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full -z-10 animate-pulse" />
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default HomeHero;
